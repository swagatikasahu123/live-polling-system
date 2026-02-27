import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp, generateStudentId } from './context/AppContext';
import { useSocket } from './hooks/useSocket';
import { UserRole } from './types';

import RoleSelectionPage from './pages/RoleSelectionPage';
import StudentNamePage from './pages/StudentNamePage';
import WaitingScreen from './components/WaitingScreen';
import StudentQuestionPage from './pages/StudentQuestionPage';
import TeacherCreatePollPage from './pages/TeacherCreatePollPage';
import TeacherLiveResultsPage from './pages/TeacherLiveResultsPage';
import PollHistoryPage from './pages/PollHistoryPage';
import KickedPage from './pages/KickedPage';

type AppView =
  | 'role-select'
  | 'student-name'
  | 'student-waiting'
  | 'student-question'
  | 'teacher-create'
  | 'teacher-results'
  | 'poll-history'
  | 'kicked';

function AppInner() {
  const { user, setUser } = useApp();
  const [view, setView] = useState<AppView>(user ? (user.role === 'teacher' ? 'teacher-create' : 'student-waiting') : 'role-select');
  const [pendingRole, setPendingRole] = useState<UserRole>('student');
  const [questionNumber, setQuestionNumber] = useState(1);

  const {
    pollState,
    chatMessages,
    participants,
    isKicked,
    submitVote,
    createPoll,
    kickStudent,
    sendChatMessage,
  } = useSocket(user);

  // React to kicked
  useEffect(() => {
    if (isKicked) setView('kicked');
  }, [isKicked]);

  // React to poll state changes
  useEffect(() => {
    if (!user) return;

    if (user.role === 'student') {
      if (pollState.poll) {
        setView('student-question');
      } else {
        if (view === 'student-question') setView('student-waiting');
      }
    } else if (user.role === 'teacher') {
      if (pollState.poll && view !== 'poll-history') {
        setView('teacher-results');
      }
    }
  }, [pollState.poll?._id, user?.role]);

  // Track question number
  useEffect(() => {
    if (pollState.poll && pollState.poll.isActive) {
      setQuestionNumber((prev) => prev);
    }
  }, [pollState.poll?._id]);

  const handleRoleContinue = (role: UserRole) => {
    setPendingRole(role);
    if (role === 'student') {
      setView('student-name');
    } else {
      const teacherId = generateStudentId();
      setUser({ studentId: teacherId, name: 'Teacher', role: 'teacher' });
      setView('teacher-create');
    }
  };

  const handleStudentName = (name: string) => {
    const studentId = generateStudentId();
    setUser({ studentId, name, role: 'student' });
    setView('student-waiting');
  };

  const handleCreatePoll = (dto: { question: string; options: { text: string; isCorrect: boolean }[]; timeLimit: number }) => {
    createPoll(dto);
    setQuestionNumber((prev) => prev + 1);
    setView('teacher-results');
  };

  if (view === 'role-select') return <RoleSelectionPage onContinue={handleRoleContinue} />;
  if (view === 'student-name') return <StudentNamePage onContinue={handleStudentName} />;
  if (view === 'kicked') return <KickedPage />;

  if (view === 'student-waiting') return (
    <>
      <WaitingScreen />
      {user && (
        <div style={{ position: 'fixed', bottom: 24, right: 24 }}>
          {/* Chat available on waiting screen too */}
        </div>
      )}
    </>
  );

  if (view === 'student-question' && pollState.poll && user) {
    return (
      <StudentQuestionPage
        poll={pollState.poll}
        timeRemaining={pollState.timeRemaining}
        hasVoted={pollState.hasVoted}
        studentId={user.studentId}
        onSubmit={submitVote}
        chatMessages={chatMessages}
        participants={participants}
        onSendChat={sendChatMessage}
        questionNumber={questionNumber}
      />
    );
  }

  if (view === 'teacher-create' && user) {
    return <TeacherCreatePollPage onAskQuestion={handleCreatePoll} />;
  }

  if (view === 'teacher-results' && pollState.poll && user) {
    return (
      <TeacherLiveResultsPage
        poll={pollState.poll}
        timeRemaining={pollState.timeRemaining}
        teacherId={user.studentId}
        chatMessages={chatMessages}
        participants={participants}
        onSendChat={sendChatMessage}
        onKickStudent={kickStudent}
        onAskNewQuestion={() => setView('teacher-create')}
        onViewHistory={() => setView('poll-history')}
        questionNumber={questionNumber}
      />
    );
  }

  if (view === 'poll-history' && user) {
    return (
      <PollHistoryPage
        onBack={() => setView(pollState.poll ? 'teacher-results' : 'teacher-create')}
        teacherId={user.studentId}
        chatMessages={chatMessages}
        participants={participants}
        onSendChat={sendChatMessage}
        onKickStudent={kickStudent}
      />
    );
  }

  // Fallback
  return <RoleSelectionPage onContinue={handleRoleContinue} />;
}

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif' } }} />
      <AppInner />
    </AppProvider>
  );
}
