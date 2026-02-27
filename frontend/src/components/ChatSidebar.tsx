import { useState, useRef, useEffect } from 'react';
import { ChatMessage, Participant } from '../types';
import { MessageCircle, X, Send } from 'lucide-react';

interface Props {
  messages: ChatMessage[];
  participants: Participant[];
  currentUserId: string;
  onSend: (text: string) => void;
  onKick?: (studentId: string) => void;
  isTeacher?: boolean;
}

export default function ChatSidebar({
  messages,
  participants,
  currentUserId,
  onSend,
  onKick,
  isTeacher = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'chat' | 'participants'>('chat');
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && tab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, tab]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <>
      {/* Floating toggle */}
      <button className="chat-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Sidebar panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 82,
            right: 24,
            width: 280,
            height: 380,
            background: 'white',
            border: '1.5px solid var(--border)',
            borderRadius: 16,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 200,
            overflow: 'hidden',
          }}
          className="animate-in"
        >
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border)' }}>
            {['chat', 'participants'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as 'chat' | 'participants')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'chat' && (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {messages.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
                    No messages yet
                  </p>
                )}
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                      {!isMe && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
                          {msg.senderName}
                        </span>
                      )}
                      {isMe && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>
                          You
                        </span>
                      )}
                      <div
                        style={{
                          background: isMe ? 'var(--primary)' : '#f0f0f0',
                          color: isMe ? 'white' : '#1a1a2e',
                          borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          padding: '8px 12px',
                          fontSize: 13,
                          maxWidth: '80%',
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div
                style={{
                  padding: '10px 12px',
                  borderTop: '1.5px solid var(--border)',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <input
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1.5px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                  }}
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  style={{
                    background: 'var(--primary)',
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Send size={14} />
                </button>
              </div>
            </>
          )}

          {tab === 'participants' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
              {participants.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
                  No students connected
                </p>
              )}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, paddingBottom: 8 }}>
                      Name
                    </th>
                    {isTeacher && (
                      <th style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, paddingBottom: 8 }}>
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.studentId}>
                      <td style={{ fontSize: 13, color: '#1a1a2e', paddingBottom: 10 }}>{p.name}</td>
                      {isTeacher && onKick && (
                        <td style={{ textAlign: 'right', paddingBottom: 10 }}>
                          <button className="kick-btn" onClick={() => onKick(p.studentId)}>
                            Kick out
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
