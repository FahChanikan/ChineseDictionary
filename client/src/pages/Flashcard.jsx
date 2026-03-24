import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Flashcard() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ word: '', pinyin: '', meaning_th: '', notes: '' })

  const fetchCards = async () => {
    try {
      const res = await api.get('/flashcards')
      setCards(res.data)
    } catch {
      alert('โหลดข้อมูลไม่สำเร็จ')
    }
    setLoading(false)
  }

  useEffect(() => { fetchCards() }, [])

  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.patch(`/flashcards/${editId}`, form)
      } else {
        await api.post('/flashcards', form)
      }
      setForm({ word: '', pinyin: '', meaning_th: '', notes: '' })
      setEditId(null)
      setShowForm(false)
      fetchCards()
    } catch {
      alert('บันทึกไม่สำเร็จ')
    }
  }

  const handleEdit = (card) => {
    setForm({ word: card.word, pinyin: card.pinyin, meaning_th: card.meaning_th, notes: card.notes || '' })
    setEditId(card.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบ?')) return
    try {
      await api.delete(`/flashcards/${id}`)
      fetchCards()
    } catch {
      alert('ลบไม่สำเร็จ')
    }
  }

  const inputStyle = {
    width: '100%', height: '42px',
    border: '1.5px solid rgba(26,18,8,0.10)',
    borderRadius: '8px', padding: '0 14px',
    fontSize: '14px', fontFamily: 'Sarabun, sans-serif',
    background: '#faf7f2', outline: 'none', marginBottom: '12px'
  }

  return (
    <div style={{ background: '#faf7f2', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '24px', fontWeight: '700', color: '#1a1208' }}>
              Flashcard ของฉัน
            </div>
            <div style={{ fontSize: '13px', color: '#9a8e7e', marginTop: '4px' }}>
              {cards.length} คำ
            </div>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ word: '', pinyin: '', meaning_th: '', notes: '' }) }}
            style={{
              background: '#c0392b', color: 'white',
              border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '14px',
              fontFamily: 'Sarabun, sans-serif',
              cursor: 'pointer', fontWeight: '500'
            }}>
            + เพิ่มคำใหม่
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{
            background: 'white', borderRadius: '16px',
            border: '1px solid rgba(26,18,8,0.10)',
            padding: '24px', marginBottom: '24px',
            boxShadow: '0 2px 16px rgba(26,18,8,0.08)'
          }}>
            <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px', color: '#1a1208' }}>
              {editId ? 'แก้ไข Flashcard' : 'เพิ่ม Flashcard ใหม่'}
            </div>
            <input style={inputStyle} placeholder="คำจีน เช่น 你好"
              value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} />
            <input style={inputStyle} placeholder="พินยิน เช่น nǐ hǎo"
              value={form.pinyin} onChange={(e) => setForm({ ...form, pinyin: e.target.value })} />
            <input style={inputStyle} placeholder="ความหมายภาษาไทย"
              value={form.meaning_th} onChange={(e) => setForm({ ...form, meaning_th: e.target.value })} />
            <input style={inputStyle} placeholder="โน้ตส่วนตัว (ไม่บังคับ)"
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSubmit} style={{
                flex: 1, height: '44px', background: '#c0392b',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer', fontFamily: 'Sarabun, sans-serif'
              }}>
                {editId ? 'บันทึกการแก้ไข' : 'เพิ่ม Flashcard'}
              </button>
              <button onClick={() => setShowForm(false)} style={{
                height: '44px', padding: '0 20px',
                background: 'transparent',
                border: '1px solid rgba(26,18,8,0.15)',
                borderRadius: '8px', fontSize: '14px',
                cursor: 'pointer', fontFamily: 'Sarabun, sans-serif', color: '#4a3f2f'
              }}>ยกเลิก</button>
            </div>
          </div>
        )}

        {/* Card List */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#9a8e7e', padding: '40px' }}>กำลังโหลด...</div>
        ) : cards.length === 0 ? (
          <div style={{
            textAlign: 'center', color: '#9a8e7e',
            padding: '60px 20px', background: 'white',
            borderRadius: '16px', border: '1px solid rgba(26,18,8,0.10)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', fontFamily: 'Noto Serif TC, serif', color: '#d3d1c7' }}>漢</div>
            ยังไม่มี Flashcard กด "+ เพิ่มคำใหม่" เพื่อเริ่มต้น
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} style={{
              background: 'white', borderRadius: '16px',
              border: '1px solid rgba(26,18,8,0.10)',
              padding: '20px 24px', marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(26,18,8,0.06)',
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{
                fontFamily: 'Noto Serif TC, serif',
                fontSize: '42px', fontWeight: '700',
                color: '#1a1208', lineHeight: 1, minWidth: '60px'
              }}>{card.word}</div>

              <div style={{ flex: 1 }}>
                <div style={{ color: '#c0392b', fontSize: '15px', fontFamily: 'Noto Sans SC, sans-serif' }}>
                  {card.pinyin}
                </div>
                <div style={{ fontSize: '15px', color: '#1a1208', marginTop: '2px' }}>
                  {card.meaning_th}
                </div>
                {card.notes && (
                  <div style={{ fontSize: '12px', color: '#9a8e7e', marginTop: '4px' }}>
                    {card.notes}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(card)} style={{
                  background: '#f2ede4', border: 'none',
                  borderRadius: '8px', padding: '8px 14px',
                  fontSize: '13px', cursor: 'pointer',
                  color: '#4a3f2f', fontFamily: 'Sarabun, sans-serif'
                }}>แก้ไข</button>
                <button onClick={() => handleDelete(card.id)} style={{
                  background: '#fef2f2', border: 'none',
                  borderRadius: '8px', padding: '8px 14px',
                  fontSize: '13px', cursor: 'pointer',
                  color: '#c0392b', fontFamily: 'Sarabun, sans-serif'
                }}>ลบ</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Flashcard