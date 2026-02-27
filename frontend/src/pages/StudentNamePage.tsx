import { useState } from 'react';

interface Props {
  onContinue: (name: string) => void;
}

export default function StudentNamePage({ onContinue }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onContinue(trimmed);
  };

  return (
    <div className="page-wrapper">
      <div className="card animate-in" style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span className="badge">Intervue Poll</span>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
          Let's <span style={{ fontWeight: 800 }}>Get Started</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 14, lineHeight: 1.6 }}>
          If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live
          polls, and see how your responses compare with your classmates
        </p>

        <div style={{ marginBottom: 28, textAlign: 'left' }}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14,
              color: '#1a1a2e',
            }}
          >
            Enter your Name
          </label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit} disabled={!name.trim()}>
          Continue
        </button>
      </div>
    </div>
  );
}
