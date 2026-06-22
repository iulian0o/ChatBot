import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home   from './pages/Home.jsx'
import Review from './pages/Review.jsx'
import About  from './pages/About.jsx'
 
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"       element={<Home />}   />
        <Route path="/review" element={<Review />} />
        <Route path="/about"  element={<About />}  />
      </Routes>
    </BrowserRouter>
  )
}