import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import useAuthStore from '../store/authStore'

const labelClass = 'text-[13px] font-medium'
const inputClass =
  'h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-fg outline-none focus:border-muted'

function Register() {
  const register = useAuthStore((state) => state.register)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-username" className={labelClass}>
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-email" className={labelClass}>
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-password" className={labelClass}>
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            aria-describedby="reg-password-hint"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <span id="reg-password-hint" className="text-xs text-muted">
            At least 8 characters
          </span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 rounded-md bg-btn text-sm font-medium text-btn-fg disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </form>

      <p className="text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-fg underline underline-offset-[3px]">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
