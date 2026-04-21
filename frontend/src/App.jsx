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
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
      const response = await fetch(`${API_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, branch })
      })
      
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      
      const data = await response.json()
      // Filter out results with 0 match score to avoid showing irrelevant careers
      const filteredData = data.filter(r => r.score > 0)
      setResults(filteredData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '3.5rem', fontWeight: 800 }}
        >
          <Sparkles color="#a855f7" size={48} />
          CareerAgent
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#9ca3af', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}
        >
          Your personalized gateway to Science, Commerce, Arts, and Technology careers.
        </motion.p>
      </header>

      <main>
        <motion.section 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel" 
          style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto 4rem' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label htmlFor="branch" style={{ display: 'block', marginBottom: '10px', color: '#e2e8f0', fontWeight: 600 }}>
                  Current Interest
                </label>
                <select
                  id="branch"
                  className="glass-input"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  style={{ width: '100%', appearance: 'none', cursor: 'pointer', padding: '12px' }}
                >
                  {branches.map(b => (
                    <option key={b} value={b} style={{ background: '#1e293b' }}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="skills" style={{ display: 'block', marginBottom: '10px', color: '#e2e8f0', fontWeight: 600 }}>
                  What are you good at?
                </label>
                <input
                  id="skills"
                  type="text"
                  className="glass-input"
                  placeholder="e.g. math, drawing, money, help..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  style={{ padding: '12px' }}
                />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="glass-button" 
              disabled={loading}
              style={{ padding: '14px', fontSize: '1.1rem' }}
            >
              {loading ? 'Analyzing Your Future...' : 'Explore Career Paths'}
              {!loading && <ChevronRight size={20} />}
            </motion.button>
          </form>
          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ marginTop: '1.5rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </motion.section>

        <AnimatePresence mode="wait">
          {results.length > 0 ? (
            <motion.section 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}
            >
              {results.map((rec, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedCareer(rec)}
                  className="glass-panel" 
                  style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #a855f7, #6366f1)' }} />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800 }}>{rec.branch}</span>
                        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', marginTop: '4px' }}>{rec.career}</h2>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '6px 14px', borderRadius: '99px', fontWeight: 700, fontSize: '0.9rem' }}>
                          {Math.round(rec.score * 100)}% Match
                        </span>
                      </div>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>{rec.description}</p>
                  </div>
                  <div style={{ marginTop: 'auto', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    View Details <ChevronRight size={16} />
                  </div>
                </motion.div>
              ))}
            </motion.section>
          ) : hasSearched && !loading && (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}
            >
              <Briefcase size={48} color="#94a3b8" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>No exact matches found</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                We couldn't find a direct match for "{skills}". Try using broader terms like "coding", "art", "money", or "help".
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedCareer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={() => setSelectedCareer(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel" 
              style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '3rem', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCareer(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#a855f7', fontWeight: 800, letterSpacing: '2px' }}>{selectedCareer.branch} Career Path</span>
                <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{selectedCareer.career}</h2>
                <p style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: 1.7 }}>{selectedCareer.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: '#4ade80', marginBottom: '1rem' }}>
                    <TrendingUp size={24} /> Market Trends
                  </h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{selectedCareer.trends}</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: '#60a5fa', marginBottom: '1rem' }}>
                    <BookOpen size={24} /> Learning Roadmap
                  </h3>
                  <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{selectedCareer.learning_path}</p>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Required Skillset</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {selectedCareer.skills_required.split(' ').map((skill, i) => (
                    <span key={i} style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '6px 16px', borderRadius: '8px', color: '#d8b4fe', fontWeight: 500 }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCareer.skill_gap && selectedCareer.skill_gap.length > 0 && (
                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#fca5a5', marginBottom: '1rem' }}>Focus Areas for You</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedCareer.skill_gap.map((gap, i) => (
                      <span key={i} style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '6px 16px', borderRadius: '8px', color: '#fca5a5', fontWeight: 600 }}>
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
