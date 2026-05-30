import mongoose, { Document, Schema } from 'mongoose';

export type LoanStatus = 'lead' | 'applied' | 'sanctioned' | 'disbursed' | 'closed' | 'rejected';
export type EmploymentMode = 'salaried' | 'self-employed' | 'unemployed';

interface PersonalDetails {
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

interface BREResult {
  eligible: boolean;
  reasons: string[];
}

interface LoanConfig {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export interface ILoanApplication extends Document {
  userId: mongoose.Types.ObjectId;
  status: LoanStatus;
  personalDetails?: PersonalDetails;
  breResult?: BREResult;
  salarySlipUrl?: string;
  loanConfig?: LoanConfig;
  rejectionReason?: string;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const loanApplicationSchema = new Schema<ILoanApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['lead', 'applied', 'sanctioned', 'disbursed', 'closed', 'rejected'],
      default: 'lead',
    },
    personalDetails: {
      fullName: String,
      pan: String,
      dob: String,
      monthlySalary: Number,
      employmentMode: { type: String, enum: ['salaried', 'self-employed', 'unemployed'] },
    },
    breResult: {
      eligible: Boolean,
      reasons: [String],
    },
    salarySlipUrl: String,
    loanConfig: {
      amount: Number,
      tenureDays: Number,
      interestRate: Number,
      simpleInterest: Number,
      totalRepayment: Number,
    },
    rejectionReason: String,
    notes: [String],
  },
  { timestamps: true }
);

export default mongoose.model<ILoanApplication>('LoanApplication', loanApplicationSchema);
