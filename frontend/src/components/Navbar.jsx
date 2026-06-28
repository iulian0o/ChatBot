import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './styles/Navbar.css'

function Navbar({ authVersion, onAuthChange }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      setLoadingUser(true)

      try {
        const response = await fetch('/api/me', {
          credentials: 'include',
        })

        if (!response.ok) {
          if (!cancelled) setUser(null)
          return
        }

        const data = await response.json()
        if (!cancelled) setUser(data.user)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoadingUser(false)
      }
    }

    loadUser()

    return () => {
      cancelled = true
    }
  }, [authVersion])

  async function handleLogout() {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})

    setUser(null)
    onAuthChange?.()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <span className="navbar-logo">{'</> CodeReview'}</span>

      <ul className="navbar-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/review" >Review</NavLink></li>
        <li><NavLink to="/about" >About</NavLink></li>
        <li>
          {user ? (
            <div className="navbar-user">
              <button className="navbar-user-button" type="button">
                {user.username}
              </button>
              <div className="navbar-user-menu">
                <button type="button" onClick={handleLogout}>Log out</button>
              </div>
            </div>
          ) : (
            <NavLink to="/login">{loadingUser ? '...' : 'Login'}</NavLink>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
