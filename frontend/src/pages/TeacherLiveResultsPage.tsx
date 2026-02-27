import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Poll, ChatMessage, Participant } from '../types';
import PollResults from '../components/PollResults';
import ChatSidebar from '../components/ChatSidebar';
import { usePollTimer } from '../hooks/usePollTimer';

interface Props {
  poll: Poll;
  timeRemaining: number | null;
  teacherId: string;
  chatMessages: ChatMessage[];
  participants: Participant[];
  onSendChat: (text: string) => void;
  onKickStudent: (studentId: string) => void;
  onAskNewQuestion: () => void;
  onViewHistory: () => void;
  questionNumber?: number;
}

export default function TeacherLiveResultsPage({
  poll,
  timeRemaining,
  teacherId,
  chatMessages,
  participants,
  onSendChat,
  onKickStudent,
  onAskNewQuestion,
  onViewHistory,
  questionNumber = 1,
}: Props) {
  const timer = usePollTimer(timeRemaining);
  const isExpired = timer !== null && timer <= 0;
  const canAskNew = poll.isCompleted || isExpired;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="page-wrapper" style={{ alignItems: 'flex-start', paddingTop: 60 }}>
      <div className="card-full animate-in" style={{ maxWidth: 660 }}>
        {/* Top right: view history */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button className="history-btn" onClick={onViewHistory}>
            <Eye size={16} />
            View Poll history
          </button>
        </div>

        {/* Question header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
            Question {questionNumber}
          </h2>
          {timer !== null && timer > 0 && (
            <span className={`timer ${timer <= 10 ? 'urgent' : 'normal'}`}>
              <Clock size={16} />
              {formatTime(timer)}
            </span>
          )}
        </div>

        <PollResults poll={poll} />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button
            className="btn-primary"
            onClick={onAskNewQuestion}
            disabled={!canAskNew}
            style={{ opacity: canAskNew ? 1 : 0.5 }}
          >
            + Ask a new question
          </button>
        </div>
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
