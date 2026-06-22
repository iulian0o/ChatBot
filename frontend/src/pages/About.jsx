import './styles/About.css'

function About() {
  const languages = [
    { name: 'JavaScript', note: 'ESLint rules, async patterns' },
    { name: 'Python', note: 'PEP 8, type hints, idiomatic style' },
    { name: 'Java', note: 'OOP patterns, exception handling' },
    { name: 'TypeScript', note: 'Type safety, interface design' },
    { name: 'C', note: 'Memory safety, pointer usage' },
    { name: 'C++', note: 'RAII, smart pointers, STL usage' },
    { name: 'Go', note: 'Idiomatic Go, error handling' },
    { name: 'Rust', note: 'Ownership, lifetimes, unsafe blocks' },
  ]

  const team = [
    { id: 'Iulian', role: 'Frontend + Server + Docker' },
    { id: 'Jaimie', role: 'Middleware layer' },
    { id: 'Maxim', role: 'LLM integration' },
    { id: 'Nam Khan', role: 'API routes' },
  ]

  return (
    <main className="about">
      <section className="about-section">
        <h2 className="about-heading">Supported languages</h2>
        <p className="about-sub">Each language includes specific prompt hints for more relevant feedback.</p>
        <ul className="lang-list">
          {languages.map(({ name, note }) => (
            <li key={name} className="lang-item">
              <span className="lang-name">{name}</span>
              <span className="lang-note">{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-heading">Model</h2>
        <p className="about-sub">Two providers, configured via environment variable.</p>
        <div className="model-grid">
          <div className="model-card">
            <h3>Groq</h3>
            <p>Cloud inference. Fast. Data processed on US servers — check privacy implications for proprietary code.</p>
          </div>
          <div className="model-card">
            <h3>GPT4All</h3>
            <p>Fully local. No data leaves your machine. Slower but suitable for sensitive codebases.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="about-heading">Team</h2>
        <ul className="team-list">
          {team.map(({ id, role }) => (
            <li key={id} className="team-item">
              <span className="team-id">Student {id}</span>
              <span className="team-role">{role}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default About