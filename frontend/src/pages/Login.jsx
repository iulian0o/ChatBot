import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Login.css'

function Login({ onAuthChange }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const isRegistering = mode === 'register'

  useEffect(() => {
    let cancelled = false

    async function checkExistingSession() {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
        })

        if (response.ok && !cancelled) {
          navigate('/review', { replace: true })
          return
        }
      } catch {
        // Stay on the login page if the session check fails.
      } finally {
        if (!cancelled) setCheckingAuth(false)
      }
    }

    checkExistingSession()

    return () => {
      cancelled = true
    }
  }, [navigate])

  function switchMode(nextMode) {
    setMode(nextMode)
    setError(null)
    setSuccess(null)
    setConfirmPassword('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    const trimmedUsername = username.trim()

    if (!trimmedUsername || !password) {
      setError('Username and password are required.')
      return
    }

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(isRegistering ? '/api/register' : '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data.error || 'Authentication failed.')
        return
      }

      if (isRegistering) {
        setSuccess('Account created. You can now sign in.')
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        return
      }

      onAuthChange?.()
      navigate('/review')
    } catch {
      setError('Could not reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      {checkingAuth ? (
        <section className="login-panel login-panel-single">
          <div className="login-card login-checking">
            Checking your session...
          </div>
        </section>
      ) : (
      <section className="login-panel">
        <div className="login-copy">
          <p className="login-eyebrow">Account access</p>
          <h1>{isRegistering ? 'Create your workspace login' : 'Welcome back'}</h1>
          <p>
            Sign in to keep review sessions tied to your account and continue previous
            code review conversations.
          </p>
        </div>

        <div className="login-card">
          <div className="login-tabs" role="tablist" aria-label="Authentication mode">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => switchMode('register')}
            >
              Register
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span>Username</span>
              <input
                autoComplete="username"
                autoFocus
                disabled={loading}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                type="text"
                value={username}
              />
            </label>

            <label>
              <span>Password</span>
              <input
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type="password"
                value={password}
              />
            </label>

            {isRegistering && (
              <label>
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  disabled={loading}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  type="password"
                  value={confirmPassword}
                />
              </label>
            )}

            {error && <p className="login-message login-error">{error}</p>}
            {success && <p className="login-message login-success">{success}</p>}

            <button className="login-submit" disabled={loading} type="submit">
              {loading ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
      )}
    </main>
  )
}

export default Login
