import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  loanApplicationId: mongoose.Types.ObjectId;
  utr: string;
  amount: number;
  date: string;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    loanApplicationId: { type: Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
    utr: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
