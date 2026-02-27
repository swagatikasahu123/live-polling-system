import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppUser, Poll, PollState, ChatMessage, Participant } from '../types';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  pollState: PollState;
  chatMessages: ChatMessage[];
  participants: Participant[];
  isKicked: boolean;
  submitVote: (pollId: string, optionId: string) => void;
  createPoll: (dto: { question: string; options: { text: string; isCorrect: boolean }[]; timeLimit: number }) => void;
  kickStudent: (studentId: string) => void;
  sendChatMessage: (text: string) => void;
}

export function useSocket(user: AppUser | null): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pollState, setPollState] = useState<PollState>({ poll: null, timeRemaining: null, hasVoted: false });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isKicked, setIsKicked] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join', { studentId: user.studentId, name: user.name, role: user.role });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      toast.error('Connection error. Retrying...');
    });

    // Poll events
    socket.on('poll:state', (state: PollState) => {
      setPollState(state);
    });

    socket.on('poll:started', ({ poll, timeRemaining }: { poll: Poll; timeRemaining: number }) => {
      setPollState({ poll, timeRemaining, hasVoted: false });
      toast.success('New question!', { icon: '🎯' });
    });

    socket.on('poll:updated', ({ poll }: { poll: Poll }) => {
      setPollState((prev) => ({ ...prev, poll }));
    });

    socket.on('poll:completed', ({ poll }: { poll: Poll }) => {
      setPollState((prev) => ({ ...prev, poll, timeRemaining: 0 }));
    });

    socket.on('vote:accepted', ({ poll }: { poll: Poll }) => {
      setPollState((prev) => ({ ...prev, poll, hasVoted: true }));
      toast.success('Vote submitted!');
    });

    socket.on('vote:rejected', ({ message }: { message: string }) => {
      toast.error(message);
    });

    socket.on('participants:updated', ({ students }: { students: Participant[] }) => {
      setParticipants(students);
    });

    socket.on('chat:message', (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on('kicked', () => {
      setIsKicked(true);
      toast.error('You have been removed by the teacher');
    });

    socket.on('error', ({ message }: { message: string }) => {
      toast.error(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const submitVote = useCallback((pollId: string, optionId: string) => {
    socketRef.current?.emit('vote:submit', { pollId, optionId });
  }, []);

  const createPoll = useCallback(
    (dto: { question: string; options: { text: string; isCorrect: boolean }[]; timeLimit: number }) => {
      socketRef.current?.emit('poll:create', dto);
    },
    []
  );

  const kickStudent = useCallback((studentId: string) => {
    socketRef.current?.emit('student:kick', { studentId });
  }, []);

  const sendChatMessage = useCallback((text: string) => {
    socketRef.current?.emit('chat:message', { text });
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    pollState,
    chatMessages,
    participants,
    isKicked,
    submitVote,
    createPoll,
    kickStudent,
    sendChatMessage,
  };
}
