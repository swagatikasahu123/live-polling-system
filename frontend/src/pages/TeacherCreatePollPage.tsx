import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface OptionInput {
  text: string;
  isCorrect: boolean;
}

interface Props {
  onAskQuestion: (dto: { question: string; options: OptionInput[]; timeLimit: number }) => void;
}

const TIME_OPTIONS = [30, 60, 90, 120];

export default function TeacherCreatePollPage({ onAskQuestion }: Props) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<OptionInput[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, text: string) => {
    setOptions(options.map((o, i) => (i === idx ? { ...o, text } : o)));
  };

  const setCorrect = (idx: number, isCorrect: boolean) => {
    setOptions(options.map((o, i) => (i === idx ? { ...o, isCorrect } : o)));
  };

  const canSubmit =
    question.trim().length > 0 && options.filter((o) => o.text.trim()).length >= 2;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAskQuestion({
      question: question.trim(),
      options: options.filter((o) => o.text.trim()),
      timeLimit,
    });
    setQuestion('');
    setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
  };

  return (
    <div className="page-wrapper" style={{ alignItems: 'flex-start', paddingTop: 60 }}>
      <div className="card-full animate-in" style={{ maxWidth: 680 }}>
        <span className="badge">Intervue Poll</span>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
          Let's <span style={{ fontWeight: 800 }}>Get Started</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
          you'll have the ability to create and manage polls, ask questions, and monitor your
          students' responses in real-time.
        </p>

        {/* Question input + timer */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <label style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>
              Enter your question
            </label>
            {/* Time selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--bg-light)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 8,
                  padding: '7px 14px',
                  fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                  color: '#1a1a2e',
                  fontWeight: 500,
                }}
              >
                {timeLimit} seconds ▾
              </button>
              {showTimeDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: 'white',
                    border: '1.5px solid var(--border)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    zIndex: 50,
                    boxShadow: 'var(--shadow)',
                    minWidth: 130,
                  }}
                >
                  {TIME_OPTIONS.map((t) => (
                    <div
                      key={t}
                      onClick={() => {
                        setTimeLimit(t);
                        setShowTimeDropdown(false);
                      }}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: 14,
                        color: t === timeLimit ? 'var(--primary)' : '#1a1a2e',
                        fontWeight: t === timeLimit ? 600 : 400,
                        background: t === timeLimit ? 'rgba(119,101,218,0.06)' : 'white',
                      }}
                    >
                      {t} seconds
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              className="textarea"
              value={question}
              onChange={(e) => {
                if (e.target.value.length <= 100) setQuestion(e.target.value);
              }}
              placeholder="Type your question here..."
              rows={3}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 10,
                right: 12,
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              {question.length}/100
            </span>
          </div>
        </div>

        {/* Options */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '0 24px',
              marginBottom: 8,
            }}
          >
            <span className="section-label">Edit Options</span>
            <span className="section-label">Is it Correct?</span>
          </div>

          {options.map((opt, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0 24px',
                marginBottom: 10,
                alignItems: 'center',
              }}
              className="animate-in"
            >
              {/* Option input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  className="option-number"
                  style={{ background: 'var(--primary-blue)', flexShrink: 0 }}
                >
                  {idx + 1}
                </div>
                <input
                  className="input"
                  value={opt.text}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  style={{ marginBottom: 0 }}
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      cursor: 'pointer',
                      flexShrink: 0,
                      display: 'flex',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Correct toggle */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {[true, false].map((val) => (
                  <label
                    key={String(val)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#1a1a2e',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: `2px solid ${opt.isCorrect === val ? 'var(--primary)' : '#ccc'}`,
                        background: opt.isCorrect === val ? 'var(--primary)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={() => setCorrect(idx, val)}
                    >
                      {opt.isCorrect === val && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
                      )}
                    </div>
                    {val ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button className="add-option-btn" onClick={addOption} disabled={options.length >= 6}>
            + Add More option
          </button>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
}
