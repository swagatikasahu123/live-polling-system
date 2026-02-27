import { Server, Socket } from 'socket.io';
import { pollService, CreatePollDto } from '../services/PollService';
import { sessionService } from '../services/SessionService';

let pollTimer: NodeJS.Timeout | null = null;

function clearPollTimer() {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
}

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ── JOIN ──────────────────────────────────────────────
    socket.on(
      'join',
      async (data: { studentId: string; name: string; role: 'student' | 'teacher' }) => {
        const { studentId, name, role } = data;
        sessionService.addParticipant(socket.id, studentId, name, role);

        if (role === 'teacher') {
          socket.join('teachers');
        } else {
          socket.join('students');
        }

        // Send current poll state on join (resilience)
        try {
          const state = await pollService.getPollState();
          if (state.poll) {
            const hasVoted =
              role === 'student'
                ? await pollService.hasStudentVoted(state.poll._id.toString(), studentId)
                : false;

            socket.emit('poll:state', {
              poll: state.poll,
              timeRemaining: state.timeRemaining,
              hasVoted,
            });
          } else {
            socket.emit('poll:state', { poll: null, timeRemaining: null, hasVoted: false });
          }
        } catch (err) {
          console.error('Error sending state on join:', err);
        }

        // Broadcast updated participants list to teachers
        broadcastParticipants(io);
      }
    );

    // ── CREATE POLL ───────────────────────────────────────
    socket.on('poll:create', async (dto: CreatePollDto) => {
      const participant = sessionService.getParticipant(socket.id);
      if (!participant || participant.role !== 'teacher') {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      try {
        clearPollTimer();
        const poll = await pollService.createAndStartPoll(dto);

        // Broadcast new poll to everyone
        io.emit('poll:started', { poll, timeRemaining: dto.timeLimit });

        // Auto-complete after timeLimit
        pollTimer = setTimeout(async () => {
          try {
            const completed = await pollService.completePoll(poll._id.toString());
            if (completed) {
              io.emit('poll:completed', { poll: completed });
            }
          } catch (err) {
            console.error('Error auto-completing poll:', err);
          }
        }, dto.timeLimit * 1000);
      } catch (err) {
        console.error('Error creating poll:', err);
        socket.emit('error', { message: 'Failed to create poll' });
      }
    });

    // ── SUBMIT VOTE ───────────────────────────────────────
    socket.on('vote:submit', async (data: { pollId: string; optionId: string }) => {
      const participant = sessionService.getParticipant(socket.id);
      if (!participant) {
        socket.emit('error', { message: 'Not registered' });
        return;
      }

      try {
        const result = await pollService.submitVote(
          data.pollId,
          participant.studentId,
          data.optionId
        );

        if (result.success && result.poll) {
          socket.emit('vote:accepted', { poll: result.poll });
          // Broadcast updated results to everyone
          io.emit('poll:updated', { poll: result.poll });
        } else {
          socket.emit('vote:rejected', { message: result.message });
        }
      } catch (err) {
        console.error('Error submitting vote:', err);
        socket.emit('error', { message: 'Failed to submit vote' });
      }
    });

    // ── KICK STUDENT ──────────────────────────────────────
    socket.on('student:kick', (data: { studentId: string }) => {
      const participant = sessionService.getParticipant(socket.id);
      if (!participant || participant.role !== 'teacher') {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      const kickedSocketId = sessionService.kickStudent(data.studentId);
      if (kickedSocketId) {
        io.to(kickedSocketId).emit('kicked', { message: 'You have been removed by the teacher' });
        broadcastParticipants(io);
      }
    });

    // ── CHAT MESSAGE ──────────────────────────────────────
    socket.on('chat:message', (data: { text: string }) => {
      const participant = sessionService.getParticipant(socket.id);
      if (!participant) return;

      io.emit('chat:message', {
        senderId: participant.studentId,
        senderName: participant.name,
        role: participant.role,
        text: data.text,
        timestamp: new Date().toISOString(),
      });
    });

    // ── DISCONNECT ────────────────────────────────────────
    socket.on('disconnect', () => {
      sessionService.removeParticipant(socket.id);
      broadcastParticipants(io);
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

function broadcastParticipants(io: Server) {
  const students = sessionService.getStudents().map((s) => ({
    studentId: s.studentId,
    name: s.name,
  }));
  io.to('teachers').emit('participants:updated', { students });
}
