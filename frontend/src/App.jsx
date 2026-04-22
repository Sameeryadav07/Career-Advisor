import { useState } from 'react'
import { Sparkles, Briefcase, TrendingUp, BookOpen, AlertCircle, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [skills, setSkills] = useState('')
  const [branch, setBranch] = useState('All')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const branches = ['All', 'Technology', 'Science', 'Commerce', 'Arts']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!skills.trim() && branch === 'All') return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const API_URL = "https://career-advisor-mdie.onrender.com"

      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skills,
          branch
        })
      })

      if (!response.ok) throw new Error('Failed to fetch recommendations')

      const data = await response.json()
      const filteredData = data.filter(r => r.score > 0)
      setResults(filteredData)

    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Sparkles color="#a855f7" />
          CareerAgent
        </h1>
        <p>Your personalized gateway to careers.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          {branches.map(b => <option key={b}>{b}</option>)}
        </select>

        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Enter skills"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Explore"}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {results.map((r, i) => (
          <div key={i}>
            <h3>{r.career}</h3>
            <p>{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
