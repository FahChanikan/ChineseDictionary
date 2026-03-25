import { useNavigate, Link } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav style={{
      background: '#faf7f2',
      borderBottom: '1px solid rgba(26,18,8,0.10)',
      padding: '0 24px', display: 'flex',
      alignItems: 'center', height: '56px',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{
        fontFamily: 'Noto Serif TC, serif',
        fontSize: '20px', fontWeight: '700',
        color: '#c0392b', display: 'flex',
        alignItems: 'center', gap: '8px'
      }}>
        漢語
        <span style={{
          fontFamily: 'Sarabun, sans-serif',
          fontSize: '13px', fontWeight: '300', color: '#9a8e7e'
        }}>พจนานุกรมจีน-อังกฤษ</span>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ fontSize: '13px', color: '#4a3f2f', textDecoration: 'none' }}>ค้นหา</Link>
        <Link to="/flashcard" style={{ fontSize: '13px', color: '#4a3f2f', textDecoration: 'none' }}>Flashcard</Link>
        <span style={{ fontSize: '13px', color: '#9a8e7e' }}>สวัสดี, {user.username}</span>
        <button onClick={handleLogout} style={{
          background: 'transparent',
          border: '1px solid rgba(26,18,8,0.15)',
          borderRadius: '8px', padding: '6px 12px',
          fontSize: '12px', color: '#4a3f2f',
          cursor: 'pointer', fontFamily: 'Sarabun, sans-serif'
        }}>ออกจากระบบ</button>
      </div>
    </nav>
  )
}

export default Navbar