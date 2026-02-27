import { v4 as uuidv4 } from 'uuid';
import { Poll, IPoll } from '../models/Poll';
import { Vote } from '../models/Vote';

export interface CreatePollDto {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  timeLimit: number;
}

export interface PollState {
  poll: IPoll | null;
  timeRemaining: number | null;
}

class PollService {
  async createAndStartPoll(dto: CreatePollDto): Promise<IPoll> {
    // End any currently active poll
    await Poll.updateMany({ isActive: true }, { isActive: false, isCompleted: true });

    const now = new Date();
    const endsAt = new Date(now.getTime() + dto.timeLimit * 1000);

    const poll = new Poll({
      question: dto.question,
      options: dto.options.map((o) => ({
        id: uuidv4(),
        text: o.text,
        isCorrect: o.isCorrect,
        votes: 0,
      })),
      timeLimit: dto.timeLimit,
      startedAt: now,
      endsAt,
      isActive: true,
      isCompleted: false,
      totalVotes: 0,
    });

    await poll.save();
    return poll;
  }

  async getActivePoll(): Promise<IPoll | null> {
    return Poll.findOne({ isActive: true });
  }

  async getPollState(): Promise<PollState> {
    const poll = await this.getActivePoll();
    if (!poll) return { poll: null, timeRemaining: null };

    const now = Date.now();
    const endsAt = poll.endsAt ? poll.endsAt.getTime() : 0;
    const timeRemaining = Math.max(0, Math.floor((endsAt - now) / 1000));

    if (timeRemaining <= 0 && poll.isActive) {
      poll.isActive = false;
      poll.isCompleted = true;
      await poll.save();
      return { poll, timeRemaining: 0 };
    }

    return { poll, timeRemaining };
  }

  async submitVote(
    pollId: string,
    studentId: string,
    optionId: string
  ): Promise<{ success: boolean; message: string; poll?: IPoll }> {
    const poll = await Poll.findById(pollId);
    if (!poll) return { success: false, message: 'Poll not found' };
    if (!poll.isActive) return { success: false, message: 'Poll is no longer active' };

    // Check timer
    const now = Date.now();
    const endsAt = poll.endsAt ? poll.endsAt.getTime() : 0;
    if (now > endsAt) {
      poll.isActive = false;
      poll.isCompleted = true;
      await poll.save();
      return { success: false, message: 'Poll has expired' };
    }

    // Check option exists
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) return { success: false, message: 'Invalid option' };

    // Prevent duplicate votes (DB-level unique index enforces this too)
    try {
      await Vote.create({ pollId, studentId, optionId });
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 11000) {
        return { success: false, message: 'You have already voted' };
      }
      throw err;
    }

    // Increment vote count
    await Poll.updateOne(
      { _id: pollId, 'options.id': optionId },
      { $inc: { 'options.$.votes': 1, totalVotes: 1 } }
    );

    const updatedPoll = await Poll.findById(pollId);
    return { success: true, message: 'Vote submitted', poll: updatedPoll! };
  }

  async completePoll(pollId: string): Promise<IPoll | null> {
    return Poll.findByIdAndUpdate(
      pollId,
      { isActive: false, isCompleted: true },
      { new: true }
    );
  }

  async getPollHistory(): Promise<IPoll[]> {
    return Poll.find({ isCompleted: true }).sort({ createdAt: -1 }).limit(50);
  }

  async hasStudentVoted(pollId: string, studentId: string): Promise<boolean> {
    const vote = await Vote.findOne({ pollId, studentId });
    return !!vote;
  }
}

export const pollService = new PollService();
