export type Role = 'borrower' | 'sales' | 'sanction' | 'disbursement' | 'collection' | 'admin';
export type LoanStatus = 'lead' | 'applied' | 'sanctioned' | 'disbursed' | 'closed' | 'rejected';
export type EmploymentMode = 'salaried' | 'self-employed' | 'unemployed';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoanConfig {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export interface LoanApplication {
  _id: string;
  userId: string | User;
  status: LoanStatus;
  personalDetails?: {
    fullName: string;
    pan: string;
    dob: string;
    monthlySalary: number;
    employmentMode: EmploymentMode;
  };
  breResult?: {
    eligible: boolean;
    reasons: string[];
  };
  salarySlipUrl?: string;
  loanConfig?: LoanConfig;
  rejectionReason?: string;
  notes?: string[];
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  loanApplicationId: string;
  utr: string;
  amount: number;
  date: string;
  recordedBy: string;
  createdAt: string;
}
