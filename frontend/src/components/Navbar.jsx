import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-logo">{'</> CodeReview'}</span>

      <ul className="navbar-links">
        {}
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/review" >Review</NavLink></li>
        <li><NavLink to="/about" >About</NavLink></li>
      </ul>
    </nav>
  )
}

export default Navbar