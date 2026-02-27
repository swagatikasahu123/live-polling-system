export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  votes: number;
}

export interface Poll {
  _id: string;
  question: string;
  options: Option[];
  timeLimit: number;
  startedAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  isCompleted: boolean;
  totalVotes: number;
  createdAt: string;
}

export interface PollState {
  poll: Poll | null;
  timeRemaining: number | null;
  hasVoted: boolean;
}

export interface ChatMessage {
  senderId: string;
  senderName: string;
  role: 'student' | 'teacher';
  text: string;
  timestamp: string;
}

export interface Participant {
  studentId: string;
  name: string;
}

export type UserRole = 'student' | 'teacher';

export interface AppUser {
  studentId: string;
  name: string;
  role: UserRole;
}
