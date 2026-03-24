import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register', { email, password, username })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', height: '44px',
    border: '1.5px solid rgba(26,18,8,0.10)',
    borderRadius: '8px', padding: '0 14px',
    fontSize: '14px', outline: 'none',
    fontFamily: 'Sarabun, sans-serif',
    background: '#faf7f2'
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#faf7f2',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        border: '1px solid rgba(26,18,8,0.10)',
        padding: '40px', width: '100%', maxWidth: '400px',
        boxShadow: '0 2px 16px rgba(26,18,8,0.08)'
      }}>
        <div style={{
          fontFamily: 'Noto Serif TC, serif',
          fontSize: '28px', fontWeight: '700',
          color: '#c0392b', textAlign: 'center', marginBottom: '8px'
        }}>漢語</div>
        <div style={{
          textAlign: 'center', color: '#9a8e7e',
          fontSize: '14px', marginBottom: '32px'
        }}>สมัครสมาชิก</div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', padding: '10px 14px',
            color: '#c0392b', fontSize: '13px', marginBottom: '16px'
          }}>{error}</div>
        )}

        {[
          { label: 'ชื่อผู้ใช้', value: username, set: setUsername, type: 'text', placeholder: 'ชื่อที่ต้องการแสดง' },
          { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'example@email.com' },
          { label: 'รหัสผ่าน', value: password, set: setPassword, type: 'password', placeholder: 'รหัสผ่าน' }
        ].map((field) => (
          <div key={field.label} style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#4a3f2f', display: 'block', marginBottom: '6px' }}>
              {field.label}
            </label>
            <input
              type={field.type} value={field.value}
              onChange={(e) => field.set(e.target.value)}
              placeholder={field.placeholder}
              style={inputStyle}
            />
          </div>
        ))}

        <button
          onClick={handleRegister} disabled={loading}
          style={{
            width: '100%', height: '48px',
            background: '#c0392b', color: 'white',
            border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '500',
            fontFamily: 'Sarabun, sans-serif',
            cursor: 'pointer', marginBottom: '16px',
            marginTop: '8px'
          }}>
          {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#9a8e7e' }}>
          มีบัญชีแล้ว?{' '}
          <Link to="/login" style={{ color: '#c0392b' }}>เข้าสู่ระบบ</Link>
        </div>
      </div>
    </div>
  )
}

export default Register