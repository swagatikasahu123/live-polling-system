import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Poll } from '../types';
import { usePollTimer } from '../hooks/usePollTimer';
import PollResults from '../components/PollResults';
import ChatSidebar from '../components/ChatSidebar';
import { ChatMessage, Participant } from '../types';

interface Props {
  poll: Poll;
  timeRemaining: number | null;
  hasVoted: boolean;
  studentId: string;
  onSubmit: (pollId: string, optionId: string) => void;
  chatMessages: ChatMessage[];
  participants: Participant[];
  onSendChat: (text: string) => void;
  questionNumber?: number;
}

export default function StudentQuestionPage({
  poll,
  timeRemaining,
  hasVoted,
  studentId,
  onSubmit,
  chatMessages,
  participants,
  onSendChat,
  questionNumber = 1,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const timer = usePollTimer(timeRemaining);
  const isExpired = timer !== null && timer <= 0;
  const showResults = hasVoted || isExpired || poll.isCompleted;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!selectedOption || showResults) return;
    onSubmit(poll._id, selectedOption);
  };

  return (
    <div className="page-wrapper" style={{ alignItems: 'flex-start', paddingTop: 60 }}>
      <div className="card-full animate-in" style={{ maxWidth: 660 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
            Question {questionNumber}
          </h2>
          {timer !== null && (
            <span className={`timer ${timer <= 10 ? 'urgent' : 'normal'}`}>
              <Clock size={16} />
              {formatTime(timer)}
            </span>
          )}
        </div>

        {showResults ? (
          <>
            <PollResults poll={poll} />
            <p
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: 'var(--text-muted)',
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Wait for the teacher to ask a new question..
            </p>
          </>
        ) : (
          <>
            <div className="question-card" style={{ marginBottom: 20 }}>
              <div className="question-bar">{poll.question}</div>
              <div style={{ padding: '16px 16px 8px' }}>
                {poll.options.map((option, idx) => (
                  <div
                    key={option.id}
                    className={`option-item ${selectedOption === option.id ? 'selected' : ''}`}
                    onClick={() => !showResults && setSelectedOption(option.id)}
                  >
                    <div
                      className="option-number"
                      style={{
                        background:
                          selectedOption === option.id ? 'var(--primary)' : 'var(--primary-blue)',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 14, color: '#1a1a2e' }}>{option.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!selectedOption}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>

      <ChatSidebar
        messages={chatMessages}
        participants={participants}
        currentUserId={studentId}
        onSend={onSendChat}
        isTeacher={false}
      />
    </div>
  );
}
