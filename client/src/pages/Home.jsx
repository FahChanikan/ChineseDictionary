import { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { numberToMark } from 'pinyin-utils';


function Home() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [aiText, setAiText] = useState({})
    const [aiLoading, setAiLoading] = useState({})
    const [saved, setSaved] = useState({})

    const formatPinyin = (rawPinyin) => {
        if (!rawPinyin) return "";
        const clean = rawPinyin.replace(/[\[\]]/g, '').replace(/([a-z]+)\s+([1-5])/gi, '$1$2');
        try {
            return numberToMark(clean);
        } catch (err) {
            return clean;
        }
    };

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
                word: word.word, pinyin: word.pinyin, meaning_th: word.meaning
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

                {/* Search */}
                <div style={{ position: 'relative', marginBottom: '32px' }}>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="ค้นหาด้วยตัวจีน, พินยิน หรือภาษาไทย... เช่น 你好"
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

                {/* Results */}
                {results.map((word, index) => (
                    <div key={index} style={{
                        background: 'white', borderRadius: '16px',
                        border: '1px solid rgba(26,18,8,0.10)',
                        boxShadow: '0 2px 16px rgba(26,18,8,0.08)',
                        marginBottom: '16px', overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '28px 28px 20px',
                            borderBottom: '1px solid rgba(26,18,8,0.08)',
                            display: 'flex', alignItems: 'flex-start', gap: '20px'
                        }}>
                            <div style={{
                                fontFamily: 'Noto Serif TC, serif',
                                fontSize: '72px', fontWeight: '700',
                                lineHeight: 1, color: '#1a1208'
                            }}>{word.word}</div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontFamily: 'Noto Sans SC, sans-serif',
                                    fontSize: '22px', fontWeight: '300',
                                    color: '#c0392b', marginBottom: '8px'
                                }}>{formatPinyin(word.pinyin)}</div>
                                <div style={{ fontSize: '18px', fontWeight: '500', color: '#1a1208' }}>
                                    {word.meaning}
                                </div>
                            </div>

                            <button
                                onClick={() => handleSave(word, index)}
                                disabled={saved[index]}
                                style={{
                                    background: saved[index] ? '#f2ede4' : 'white',
                                    border: `1.5px solid ${saved[index] ? 'rgba(26,18,8,0.10)' : '#c0392b'}`,
                                    borderRadius: '8px', padding: '8px 14px',
                                    fontSize: '13px',
                                    color: saved[index] ? '#9a8e7e' : '#c0392b',
                                    cursor: saved[index] ? 'default' : 'pointer',
                                    fontFamily: 'Sarabun, sans-serif', fontWeight: '500'
                                }}>
                                {saved[index] ? '✓ บันทึกแล้ว' : '+ บันทึก'}
                            </button>
                        </div>

                        {/* AI Button + Result */}
                        <div style={{ padding: '20px 28px' }}>
                            <button
                                onClick={() => handleAI(word, index)}
                                disabled={aiLoading[index]}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #1a1208 0%, #3d2b1a 100%)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    padding: '14px 20px', fontSize: '15px', fontWeight: '500',
                                    cursor: 'pointer', fontFamily: 'Sarabun, sans-serif'
                                }}>
                                {aiLoading[index] ? 'AI กำลังวิเคราะห์...' : '🤖 AI อธิบายบริบทการใช้งาน'}
                            </button>

                            {aiText[index] && (
                                <div style={{
                                    marginTop: '16px', background: '#f2ede4',
                                    borderRadius: '12px', padding: '18px 20px',
                                    fontSize: '14px', color: '#4a3f2f',
                                    lineHeight: '1.8', borderLeft: '3px solid #1a1208',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    <div style={{
                                        fontSize: '11px', fontWeight: '500',
                                        color: '#9a8e7e', letterSpacing: '0.06em',
                                        marginBottom: '8px', textTransform: 'uppercase'
                                    }}>การวิเคราะห์โดย AI</div>
                                    {aiText[index]}
                                </div>
                            )}
                        </div>
                    </div>
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