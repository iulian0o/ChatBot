import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Review from './pages/Review'
import About from './pages/About'
import Login from './pages/Login'

function App() {
  const [authVersion, setAuthVersion] = useState(0)

  function refreshAuth() {
    setAuthVersion((version) => version + 1)
  }

  return (
    <BrowserRouter>
      <Navbar authVersion={authVersion} onAuthChange={refreshAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/review" element={<Review />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onAuthChange={refreshAuth} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
