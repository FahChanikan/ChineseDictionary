import { numberToMark } from 'pinyin-utils'

const WordCard = ({ word, pinyin, meaning, onSave, saved, onAI, aiLoading, aiText }) => {

  const formatPinyin = (raw) => {
    if (!raw) return ''
    try {
      const clean = raw.replace(/[\[\]]/g, '').trim()
      return numberToMark(clean)
    } catch { return raw }
  }

  // ตัด meaning ให้เหลือแค่บรรทัดแรก ไม่เกิน 80 ตัวอักษร
  const formatMeaning = (raw) => {
    if (!raw) return ''
    const first = raw.split('\n')[0].split('/')[0].trim()
    return first.length > 80 ? first.substring(0, 80) + '...' : first
  }

  // pinyin แสดงแค่บรรทัดแรก
  const formatPinyinClean = (raw) => {
    if (!raw) return ''
    const first = raw.split('\n')[0].trim()
    return formatPinyin(first)
  }

  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      border: '1px solid rgba(26,18,8,0.10)',
      boxShadow: '0 2px 16px rgba(26,18,8,0.08)',
      marginBottom: '16px', overflow: 'hidden'
    }}>
      <div style={{
        padding: '24px 28px',
        borderBottom: '1px solid rgba(26,18,8,0.08)',
        display: 'flex', alignItems: 'center', gap: '20px'
      }}>
        {/* ตัวอักษรจีน */}
        <div style={{
          fontFamily: 'Noto Serif TC, serif',
          fontSize: '64px', fontWeight: '700',
          color: '#1a1208', lineHeight: 1,
          flexShrink: 0
        }}>{word}</div>

        {/* พินยิน + ความหมาย */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: '18px', fontWeight: '400',
            color: '#c0392b', marginBottom: '6px',
            whiteSpace: 'nowrap', overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{formatPinyinClean(pinyin)}</div>
          <div style={{
            fontSize: '15px', color: '#4a3f2f',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {formatMeaning(meaning)}
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <button onClick={onSave} disabled={saved} style={{
          flexShrink: 0,
          background: saved ? '#f2ede4' : 'white',
          border: `1.5px solid ${saved ? 'rgba(26,18,8,0.10)' : '#c0392b'}`,
          borderRadius: '8px', padding: '8px 14px',
          fontSize: '13px',
          color: saved ? '#9a8e7e' : '#c0392b',
          cursor: saved ? 'default' : 'pointer',
          fontFamily: 'Sarabun, sans-serif', fontWeight: '500',
          whiteSpace: 'nowrap'
        }}>
          {saved ? '✓ บันทึกแล้ว' : '+ บันทึก'}
        </button>
      </div>

      {/* AI Section */}
      <div style={{ padding: '16px 28px' }}>
        <button onClick={onAI} disabled={aiLoading} style={{
          width: '100%',
          background: aiLoading ? '#3d2b1a' : 'linear-gradient(135deg, #1a1208 0%, #3d2b1a 100%)',
          color: 'white', border: 'none', borderRadius: '10px',
          padding: '12px 20px', fontSize: '14px', fontWeight: '500',
          cursor: aiLoading ? 'not-allowed' : 'pointer',
          fontFamily: 'Sarabun, sans-serif', opacity: aiLoading ? 0.8 : 1
        }}>
          {aiLoading ? '⏳ AI กำลังวิเคราะห์...' : '🤖 AI อธิบายบริบทการใช้งาน'}
        </button>

        {aiText && (
          <div style={{
            marginTop: '12px', background: '#f2ede4',
            borderRadius: '12px', padding: '16px 20px',
            fontSize: '14px', color: '#4a3f2f',
            lineHeight: '1.8', borderLeft: '3px solid #1a1208',
            whiteSpace: 'pre-wrap'
          }}>
            <div style={{
              fontSize: '11px', fontWeight: '500', color: '#9a8e7e',
              letterSpacing: '0.06em', marginBottom: '8px',
              textTransform: 'uppercase'
            }}>การวิเคราะห์โดย AI</div>
            {aiText}
          </div>
        )}
      </div>
    </div>
  )
}

export default WordCard