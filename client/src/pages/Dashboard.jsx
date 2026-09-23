import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const fetchVault = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vault');
      setFiles(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vault:', err);
      setError('Failed to load vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchVault();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob', 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-text font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-surface border-r border-border hidden md:flex flex-col shadow-sm z-10">
        <div className="p-8 border-b border-border">
          <h1 className="text-3xl font-extrabold text-primary flex items-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            Enclave
          </h1>
        </div>
        <nav className="flex-1 p-6">
          <ul className="space-y-4">
            <li>
              <a href="#" className="flex items-center gap-4 p-4 bg-blue-50 text-primary rounded-xl font-bold text-xl shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                My Vault
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-4 p-4 hover:bg-gray-50 text-muted rounded-xl font-semibold text-xl transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-24 bg-surface border-b border-border flex items-center justify-between px-10 shadow-sm z-0">
          <h2 className="text-3xl font-bold md:hidden text-primary">Enclave</h2>
          <div className="flex-1"></div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-border pr-6">
              <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-2xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-text font-bold text-xl hidden sm:block">{user?.username}</span>
            </div>
            <button 
              onClick={logout}
              className="px-6 py-2.5 border-2 border-border hover:bg-gray-50 text-text font-bold rounded-xl transition-colors text-lg"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Vault Content Area */}
        <div className="p-12 flex-1 overflow-y-auto bg-background">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-4xl font-extrabold text-text">My Files</h3>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
            <button 
              onClick={handleUploadClick}
              disabled={uploading}
              className={`${uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'} px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-3 text-xl`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  Upload File
                </>
              )}
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-primary text-2xl font-bold flex items-center gap-4">
                 <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Loading your vault...
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200 text-center text-xl font-bold">{error}</div>
          ) : files.length === 0 ? (
            <div className="bg-surface p-20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-32 h-32 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-8">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <p className="text-text font-extrabold text-3xl mb-4">Your vault is completely empty</p>
              <p className="text-xl text-muted max-w-lg leading-relaxed">Click the "Upload File" button above to securely store your first file in the Enclave.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {files.map((file) => (
                <div key={file._id} className="bg-surface p-8 rounded-2xl border border-border flex flex-col justify-between h-56 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-blue-50 text-primary rounded-xl shrink-0">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-2xl text-text truncate mb-2" title={file.originalName}>
                        {file.originalName}
                      </h4>
                      <p className="text-lg text-muted font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => handleDownload(file._id, file.originalName)}
                      className="text-lg bg-blue-50 hover:bg-primary hover:text-white text-primary px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
