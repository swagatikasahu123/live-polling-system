export default function KickedPage() {
  return (
    <div className="page-wrapper">
      <div className="card animate-in" style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <span className="badge">Intervue Poll</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a2e', marginBottom: 12 }}>
          You've been Kicked out !
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
          Looks like the teacher had removed you from the poll system .Please Try again sometime.
        </p>
      </div>
    </div>
  );
}
