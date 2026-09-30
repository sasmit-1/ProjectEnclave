import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../api/axios'
import ThemeToggle from '../components/ThemeToggle'
import useAuthStore from '../store/authStore'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 40 -> "40 B", 6144 -> "6.0 KB", 5033164 -> "4.8 MB", 1181116006 -> "1.1 GB"
function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit++
  }
  if (unit === 0) return `${size} B`
  return `${size < 10 ? size.toFixed(1) : Math.round(size)} ${units[unit]}`
}

// "30 Sep 2026"
function formatDate(value) {
  const d = new Date(value)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function UploadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}

function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const [progress, setProgress] = useState(null) // null when not uploading
  const [uploadName, setUploadName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)
  const [downloadError, setDownloadError] = useState('')
  const [tamperedFile, setTamperedFile] = useState(null) // name of the file that failed the integrity check

  const fetchFiles = useCallback(
    () =>
      api
        .get('/vault')
        .then(({ data }) => {
          setFiles(data)
          setError('')
        })
        .catch((err) => setError(err.response?.data?.message || 'Could not load your vault'))
        .finally(() => setLoading(false)),
    [],
  )

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    e.target.value = '' // lets the same file be picked again
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setUploadError('')
    setUploadName(file.name)
    setProgress(0)
    try {
      await api.post('/files/upload', formData, {
        onUploadProgress: (event) => {
          if (event.total) setProgress(Math.round((event.loaded * 100) / event.total))
        },
      })
      await fetchFiles()
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed')
    } finally {
      setProgress(null)
    }
  }

  // Fetch as a blob (so the JWT header is sent), then save via a temporary link
  const handleDownload = async (file) => {
    setDownloadError('')
    setDownloadingId(file._id)
    try {
      const { data } = await api.get(`/files/download/${file._id}`, { responseType: 'blob' })
      const url = URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = file.originalName
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      if (!err.response) {
        // The server cut the stream off mid-download: the integrity check failed
        setTamperedFile(file.originalName)
      } else {
        // The error body is a Blob because of responseType: 'blob'
        let message = 'Download failed'
        try {
          message = JSON.parse(await err.response.data.text()).message
        } catch {
          // keep the default message
        }
        setDownloadError(message)
      }
    } finally {
      setDownloadingId(null)
    }
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const summary = loading
    ? ''
    : `${files.length} ${files.length === 1 ? 'file' : 'files'}${files.length ? ` · ${formatSize(totalSize)}` : ''}`
  const statusMessage = loading
    ? 'Loading...'
    : error || (files.length === 0 ? 'No files yet. Use Upload to add one.' : '')
  const actionError = uploadError || downloadError

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      {tamperedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="tamper-title"
            aria-describedby="tamper-desc"
            className="flex w-full max-w-[440px] flex-col gap-3 rounded-lg border border-danger-border bg-dialog p-6"
          >
            <div className="flex items-center gap-2.5 text-danger">
              <AlertIcon />
              <h2 id="tamper-title" className="text-lg font-semibold">
                Download Blocked
              </h2>
            </div>
            <p id="tamper-desc" className="text-sm leading-relaxed">
              File integrity compromised. Potential tampering detected.
            </p>
            <p className="text-[13px] leading-relaxed text-muted">
              {tamperedFile} failed its integrity check, so the download was stopped.
            </p>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setTamperedFile(null)}
                className="h-10 rounded-md bg-btn px-4 text-sm font-medium text-btn-fg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6 sm:px-12">
        <span className="text-[17px] font-semibold tracking-tight">Enclave</span>
        <div className="flex items-center gap-3">
          <span className="mr-1 hidden text-[13px] text-muted sm:inline">{user?.username}</span>
          <ThemeToggle />
          <button
            type="button"
            onClick={logout}
            className="h-9 rounded-md border border-border px-3 text-[13px]"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-7 px-6 py-10 sm:px-12">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
            <p className="min-h-5 font-mono text-[13px] text-muted">{summary}</p>
          </div>
          <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            disabled={progress !== null}
            className="flex h-10 items-center gap-2 rounded-md bg-btn px-4 text-sm font-medium text-btn-fg disabled:opacity-45"
          >
            <UploadIcon />
            Upload
          </button>
        </div>

        {progress !== null && (
          <div role="status" className="flex flex-col gap-2.5 rounded-md bg-surface px-4 py-3.5">
            <div className="flex justify-between gap-4 text-[13px]">
              <span className="truncate">
                Uploading <span className="text-muted">{uploadName}</span>
              </span>
              <span className="font-mono text-muted">{progress}%</span>
            </div>
            <div className="h-[3px] bg-track">
              <div className="h-[3px] bg-fg" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {actionError && (
          <p role="alert" className="text-sm text-danger">
            {actionError}
          </p>
        )}

        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th scope="col" className="border-b border-border pr-4 pb-2.5 font-medium">
                Name
              </th>
              <th scope="col" className="w-[100px] border-b border-border pr-4 pb-2.5 text-right font-medium sm:w-[120px]">
                Size
              </th>
              <th scope="col" className="hidden w-[160px] border-b border-border pr-4 pb-2.5 pl-8 font-medium sm:table-cell">
                Uploaded
              </th>
              <th scope="col" className="w-[110px] border-b border-border pb-2.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {statusMessage ? (
              <tr>
                <td
                  colSpan={4}
                  className={`border-b border-line py-14 text-center ${error ? 'text-danger' : 'text-muted'}`}
                >
                  {statusMessage}
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file._id}>
                  <td className="truncate border-b border-line py-2 pr-4" title={file.originalName}>
                    {file.originalName}
                  </td>
                  <td className="border-b border-line py-2 pr-4 text-right font-mono text-[13px] text-muted">
                    {formatSize(file.size)}
                  </td>
                  <td className="hidden border-b border-line py-2 pr-4 pl-8 font-mono text-[13px] text-muted sm:table-cell">
                    {formatDate(file.createdAt)}
                  </td>
                  <td className="border-b border-line py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(file)}
                      disabled={downloadingId !== null}
                      className="h-9 px-0.5 text-[13px] font-medium underline underline-offset-[3px] disabled:opacity-50"
                    >
                      {downloadingId === file._id ? 'Downloading...' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  )
}

export default Dashboard
