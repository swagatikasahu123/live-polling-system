export default function WaitingScreen() {
  return (
    <div className="page-wrapper">
      <div
        className="card animate-in"
        style={{
          textAlign: 'center',
          maxWidth: 560,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <span className="badge" style={{ marginBottom: 24 }}>Intervue Poll</span>
        <div className="spinner" style={{ marginBottom: 20 }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>
          Wait for the teacher to ask questions..
        </h2>
      </div>
    </div>
  );
}
