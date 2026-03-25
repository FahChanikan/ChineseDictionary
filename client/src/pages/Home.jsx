import { useState } from 'react'
import Navbar from '../components/Navbar'
import WordCard from '../components/WordCard'
import api from '../services/api'

function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [aiText, setAiText] = useState({})
  const [aiLoading, setAiLoading] = useState({})
  const [saved, setSaved] = useState({})

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await api.get(`/dictionary/search?q=${query}`)
      setResults(res.data)
    } catch {
      alert('ค้นหาไม่สำเร็จ')
    }
    setLoading(false)
  }

  const handleSave = async (word, index) => {
    try {
      await api.post('/flashcards', {
        word: word.word, pinyin: word.pinyin,
        meaning_th: word.meaning, notes: ''
      })
      setSaved((prev) => ({ ...prev, [index]: true }))
    } catch {
      alert('บันทึกไม่สำเร็จ')
    }
  }

  const handleAI = async (word, index) => {
    setAiLoading((prev) => ({ ...prev, [index]: true }))
    try {
      const res = await api.post('/ai/explain', {
        word: word.word, pinyin: word.pinyin, meaning: word.meaning
      })
      setAiText((prev) => ({ ...prev, [index]: res.data.explanation }))
    } catch {
      alert('AI ไม่สำเร็จ')
    }
    setAiLoading((prev) => ({ ...prev, [index]: false }))
  }

  return (
    <div style={{ background: '#faf7f2', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="ค้นหาด้วยตัวจีน, พินยิน หรือภาษาอังกฤษ... เช่น 你好"
            style={{
              width: '100%', height: '56px',
              border: '1.5px solid rgba(26,18,8,0.10)',
              borderRadius: '12px', background: 'white',
              padding: '0 56px 0 20px', fontSize: '15px',
              fontFamily: 'Sarabun, sans-serif', outline: 'none',
              boxShadow: '0 2px 16px rgba(26,18,8,0.08)'
            }}
          />
          <button onClick={handleSearch} style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)',
            background: '#c0392b', color: 'white',
            border: 'none', borderRadius: '8px',
            width: '36px', height: '36px', cursor: 'pointer',
            fontSize: '16px'
          }}>🔍</button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: '#9a8e7e', padding: '40px' }}>
            กำลังค้นหา...
          </div>
        )}

        {results.map((word, index) => (
          <WordCard
            key={index}
            word={word.word}
            pinyin={word.pinyin}
            meaning={word.meaning}
            onSave={() => handleSave(word, index)}
            saved={saved[index]}
            onAI={() => handleAI(word, index)}
            aiLoading={aiLoading[index]}
            aiText={aiText[index]}
          />
        ))}

        {results.length === 0 && !loading && query && (
          <div style={{ textAlign: 'center', color: '#9a8e7e', padding: '40px' }}>
            ไม่พบคำที่ค้นหา
          </div>
        )}
      </div>
    </div>
  )
}

export default Home