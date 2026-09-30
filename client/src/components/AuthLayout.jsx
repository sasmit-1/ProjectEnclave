import { useEffect, useState } from 'react'
import api from '../api/axios'
import ThemeToggle from './ThemeToggle'

// Shared frame for the Log in and Register pages: name + theme button on top, server status at the bottom
function AuthLayout({ children }) {
  const [online, setOnline] = useState(null)

  useEffect(() => {
    api
      .get('/health')
      .then(() => setOnline(true))
      .catch(() => setOnline(false))
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <header className="flex h-16 shrink-0 items-center justify-between px-6 sm:px-12">
        <span className="text-[17px] font-semibold tracking-tight">Enclave</span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-[360px] flex-col gap-7">{children}</div>
      </main>

      <footer className="flex h-14 shrink-0 items-center gap-2 px-6 text-xs text-muted sm:px-12">
        <span
          aria-hidden="true"
          className={`h-[7px] w-[7px] rounded-full ${
            online === null ? 'bg-muted' : online ? 'bg-ok' : 'bg-danger'
          }`}
        />
        {online === null ? 'Checking server...' : online ? 'Server online' : 'Server offline'}
      </footer>
    </div>
  )
}

export default AuthLayout
