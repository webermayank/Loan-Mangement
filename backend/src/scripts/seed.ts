import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db';
import LoanApplication from '../models/LoanApplication';
import Payment from '../models/Payment';
import User, { UserRole } from '../models/User';
import { calculateLoan } from '../services/loan.service';
import { runBRE } from '../services/bre.service';

const password = 'Password@123';

const accounts: Array<{ name: string; email: string; role: UserRole }> = [
  { name: 'Borrower Demo', email: 'borrower@lms.com', role: 'borrower' },
  { name: 'Sales Officer', email: 'sales@lms.com', role: 'sales' },
  { name: 'Sanction Officer', email: 'sanction@lms.com', role: 'sanction' },
  { name: 'Disbursement Officer', email: 'disburse@lms.com', role: 'disbursement' },
  { name: 'Collection Officer', email: 'collection@lms.com', role: 'collection' },
  { name: 'Admin User', email: 'admin@lms.com', role: 'admin' },
  { name: 'Applied Demo', email: 'demo.applied@lms.com', role: 'borrower' },
  { name: 'Sanctioned Demo', email: 'demo.sanctioned@lms.com', role: 'borrower' },
  { name: 'Disbursed Demo', email: 'demo.disbursed@lms.com', role: 'borrower' },
];

async function upsertUser(account: { name: string; email: string; role: UserRole }) {
  let user = await User.findOne({ email: account.email });
  if (!user) {
    user = await User.create({ ...account, password });
    return user;
  }

  user.name = account.name;
  user.role = account.role;
  user.password = password;
  await user.save();
  return user;
}

async function createApplication(email: string, status: 'applied' | 'sanctioned' | 'disbursed') {
  const user = await User.findOne({ email });
  if (!user) return;

  const personalDetails = {
    fullName: user.name,
    pan: 'ABCDE1234F',
    dob: '1994-06-15',
    monthlySalary: 72000,
    employmentMode: 'salaried' as const,
  };
  const loanConfig = calculateLoan(status === 'disbursed' ? 180000 : 125000, status === 'disbursed' ? 120 : 90);

  await LoanApplication.create({
    userId: user._id,
    status,
    personalDetails,
    breResult: runBRE(personalDetails),
    salarySlipUrl: '/uploads/demo-salary-slip.pdf',
    loanConfig,
    notes: [`Seeded ${status} application for evaluator walkthrough.`],
  });
}

async function seed() {
  await connectDB();
  await Payment.deleteMany({});
  await LoanApplication.deleteMany({});

  for (const account of accounts) {
    await upsertUser(account);
  }

  await createApplication('demo.applied@lms.com', 'applied');
  await createApplication('demo.sanctioned@lms.com', 'sanctioned');
  await createApplication('demo.disbursed@lms.com', 'disbursed');

  console.table(accounts.map(({ role, email }) => ({ role, email, password })));
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
