import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import useAuthStore from '../store/authStore'

const labelClass = 'text-[13px] font-medium'
const inputClass =
  'h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-fg outline-none focus:border-muted'

function Login() {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className={labelClass}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className={labelClass}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 rounded-md bg-btn text-sm font-medium text-btn-fg disabled:opacity-50"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </form>

      <p className="text-sm text-muted">
        No account?{' '}
        <Link to="/register" className="font-medium text-fg underline underline-offset-[3px]">
          Register
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
