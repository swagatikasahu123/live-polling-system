import { Poll } from '../types';

interface Props {
  poll: Poll;
}

export default function PollResults({ poll }: Props) {
  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);

  return (
    <div className="question-card">
      <div className="question-bar">{poll.question}</div>
      <div style={{ padding: '16px 16px 8px' }}>
        {poll.options.map((option, idx) => {
          const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          const isWinner = option.votes === maxVotes && poll.totalVotes > 0;

          return (
            <div key={option.id} className="result-bar-container" style={{ marginBottom: 10 }}>
              <div className="result-bar-inner">
                <div
                  className={`result-bar-fill ${isWinner ? 'winner' : ''}`}
                  style={{ width: `${pct}%` }}
                />
                <div className="result-bar-content">
                  <div
                    className="option-number"
                    style={{ background: isWinner ? 'var(--primary)' : 'var(--primary-blue)' }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: 14, color: '#1a1a2e', fontWeight: 500 }}>
                    {option.text}
                  </span>
                  <span className="result-percentage">{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
