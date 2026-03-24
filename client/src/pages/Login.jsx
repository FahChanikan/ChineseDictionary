import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด')
    }
    setLoading(false)
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
        }}>พจนานุกรมจีน-ไทย</div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', padding: '10px 14px',
            color: '#c0392b', fontSize: '13px', marginBottom: '16px'
          }}>{error}</div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: '#4a3f2f', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{
              width: '100%', height: '44px',
              border: '1.5px solid rgba(26,18,8,0.10)',
              borderRadius: '8px', padding: '0 14px',
              fontSize: '14px', outline: 'none',
              fontFamily: 'Sarabun, sans-serif',
              background: '#faf7f2'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', color: '#4a3f2f', display: 'block', marginBottom: '6px' }}>
            รหัสผ่าน
          </label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', height: '44px',
              border: '1.5px solid rgba(26,18,8,0.10)',
              borderRadius: '8px', padding: '0 14px',
              fontSize: '14px', outline: 'none',
              fontFamily: 'Sarabun, sans-serif',
              background: '#faf7f2'
            }}
          />
        </div>

        <button
          onClick={handleLogin} disabled={loading}
          style={{
            width: '100%', height: '48px',
            background: '#c0392b', color: 'white',
            border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '500',
            fontFamily: 'Sarabun, sans-serif',
            cursor: 'pointer', marginBottom: '16px'
          }}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#9a8e7e' }}>
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" style={{ color: '#c0392b' }}>สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  )
}

export default Login