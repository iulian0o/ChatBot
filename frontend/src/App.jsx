import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Review from './pages/Review'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      {}
      <Navbar />

      {}
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/review"  element={<Review />} />
        <Route path="/about"   element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App