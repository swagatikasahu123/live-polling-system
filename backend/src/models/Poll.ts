import mongoose, { Schema, Document } from 'mongoose';

export interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
  votes: number;
}

export interface IPoll extends Document {
  question: string;
  options: IOption[];
  timeLimit: number;
  startedAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
  isCompleted: boolean;
  totalVotes: number;
  createdAt: Date;
}

const OptionSchema = new Schema<IOption>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  votes: { type: Number, default: 0 },
});

const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },
    options: [OptionSchema],
    timeLimit: { type: Number, required: true, default: 60 },
    startedAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    isActive: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    totalVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Poll = mongoose.model<IPoll>('Poll', PollSchema);
