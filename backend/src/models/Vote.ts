import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  pollId: string;
  studentId: string;
  optionId: string;
  submittedAt: Date;
}

const VoteSchema = new Schema<IVote>({
  pollId: { type: String, required: true },
  studentId: { type: String, required: true },
  optionId: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicate votes
VoteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
