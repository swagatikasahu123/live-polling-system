import { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Poll } from '../types';
import PollResults from '../components/PollResults';
import { ChatMessage, Participant } from '../types';
import ChatSidebar from '../components/ChatSidebar';


interface Props {
  onBack: () => void;
  teacherId: string;
  chatMessages: ChatMessage[];
  participants: Participant[];
  onSendChat: (text: string) => void;
  onKickStudent: (studentId: string) => void;
}

export default function PollHistoryPage({ onBack, teacherId, chatMessages, participants, onSendChat, onKickStudent }: Props) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${(import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:3001'}/api/poll/history`)
      .then((r) => r.json())
      .then((data) => {
        setPolls(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper" style={{ alignItems: 'flex-start', paddingTop: 60 }}>
      <div className="card-full animate-in" style={{ maxWidth: 660 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>
            View <span style={{ fontWeight: 800 }}>Poll History</span>
          </h1>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" />
          </div>
        )}

        {!loading && polls.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>
            No poll history yet.
          </p>
        )}

        {polls.map((poll, idx) => (
          <div key={poll._id} style={{ marginBottom: 32 }} className="animate-in">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>
              Question {idx + 1}
            </h3>
            <PollResults poll={poll} />
          </div>
        ))}
      </div>

      <ChatSidebar
        messages={chatMessages}
        participants={participants}
        currentUserId={teacherId}
        onSend={onSendChat}
        onKick={onKickStudent}
        isTeacher={true}
      />
    </div>
  );
}
