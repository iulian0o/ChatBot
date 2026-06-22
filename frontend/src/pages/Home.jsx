import { useNavigate } from 'react-router-dom'
import './styles/Home.css'

function Home() {
  const navigate = useNavigate()

  const features = [
    { icon: '🐛', title: 'Bug detection', desc: 'Spots logic errors, off-by-ones, null refs, and common anti-patterns.' },
    { icon: '🔒', title: 'Security scan', desc: 'Flags injection risks, exposed secrets, and insecure defaults.' },
    { icon: '⚡', title: 'Performance tips', desc: 'Highlights unnecessary loops, memory leaks, and costly operations.' },
  ]

  return (
    <main className="home">
      <section className="home-hero">
        <p className="home-eyebrow">AI-powered x multi-language</p>
        <h1 className="home-title">
          Catch bugs before<br />your reviewer does.
        </h1>
        <p className="home-subtitle">
          Paste any code snippet and get an instant review: bugs, security
          issues, performance tips, and style feedback, all in one reply.
        </p>
        <button className="home-cta" onClick={() => navigate('/review')}>
          Start reviewing →
        </button>
      </section>

      <section className="home-features">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="home-card">
            <span className="home-card-icon">{icon}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

export default Home