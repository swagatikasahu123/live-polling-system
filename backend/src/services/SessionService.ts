interface Participant {
  socketId: string;
  studentId: string;
  name: string;
  role: 'student' | 'teacher';
  joinedAt: Date;
}

class SessionService {
  private participants: Map<string, Participant> = new Map(); // socketId -> Participant

  addParticipant(socketId: string, studentId: string, name: string, role: 'student' | 'teacher') {
    this.participants.set(socketId, { socketId, studentId, name, role, joinedAt: new Date() });
  }

  removeParticipant(socketId: string) {
    this.participants.delete(socketId);
  }

  getParticipant(socketId: string): Participant | undefined {
    return this.participants.get(socketId);
  }

  getStudents(): Participant[] {
    return Array.from(this.participants.values()).filter((p) => p.role === 'student');
  }

  kickStudent(studentId: string): string | null {
    for (const [socketId, p] of this.participants.entries()) {
      if (p.studentId === studentId) {
        this.participants.delete(socketId);
        return socketId;
      }
    }
    return null;
  }

  getSocketIdByStudentId(studentId: string): string | null {
    for (const [socketId, p] of this.participants.entries()) {
      if (p.studentId === studentId) return socketId;
    }
    return null;
  }
}

export const sessionService = new SessionService();
