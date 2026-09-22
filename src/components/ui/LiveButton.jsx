export function LiveButton() {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 20, border: 'none',
      background: '#e11d2e', color: '#fff', fontWeight: 700,
      fontSize: 13, letterSpacing: 0.5, cursor: 'pointer',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: '#fff', animation: 'blink 1.2s infinite',
      }} />
      LIVE
      <style>{`@keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0.2 } }`}</style>
    </button>
  )
}