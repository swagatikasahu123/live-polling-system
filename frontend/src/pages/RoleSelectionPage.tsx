import { useState } from 'react';
import { UserRole } from '../types';

interface Props {
  onContinue: (role: UserRole) => void;
}

export default function RoleSelectionPage({ onContinue }: Props) {
  const [selected, setSelected] = useState<UserRole>('student');

  return (
    <div className="page-wrapper">
      <div className="card animate-in" style={{ textAlign: 'center', maxWidth: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span className="badge">Intervue Poll</span>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
          Welcome to the <span style={{ color: 'var(--primary)' }}>Live Polling System</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 15, lineHeight: 1.5 }}>
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 36 }}>
          <div
            className={`role-card ${selected === 'student' ? 'selected' : ''}`}
            onClick={() => setSelected('student')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
                I'm a Student
              </h3>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `2px solid ${selected === 'student' ? 'var(--primary)' : '#ccc'}`,
                  background: selected === 'student' ? 'var(--primary)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {selected === 'student' && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'left', lineHeight: 1.5 }}>
              Submit answers and view live poll results in real-time.
            </p>
          </div>

          <div
            className={`role-card ${selected === 'teacher' ? 'selected' : ''}`}
            onClick={() => setSelected('teacher')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
                I'm a Teacher
              </h3>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: `2px solid ${selected === 'teacher' ? 'var(--primary)' : '#ccc'}`,
                  background: selected === 'teacher' ? 'var(--primary)' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {selected === 'teacher' && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'left', lineHeight: 1.5 }}>
              Submit answers and view live poll results in real-time.
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={() => onContinue(selected)}>
          Continue
        </button>
      </div>
    </div>
  );
}
