import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import LoanApplication from '../models/LoanApplication';
import Payment from '../models/Payment';

// SALES
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const applications = await LoanApplication.find({ status: { $in: ['lead', 'applied'] } })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ applications });
};

// SANCTION
export const getSanctionQueue = async (_req: AuthRequest, res: Response): Promise<void> => {
  const applications = await LoanApplication.find({ status: 'applied' })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ applications });
};

const sanctionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
});

export const sanctionLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = sanctionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid action' });
    return;
  }

  const application = await LoanApplication.findById(req.params.id);
  if (!application || application.status !== 'applied') {
    res.status(404).json({ message: 'Application not found or not in applied state' });
    return;
  }

  if (parsed.data.action === 'approve') {
    application.status = 'sanctioned';
  } else {
    application.status = 'rejected';
    application.rejectionReason = parsed.data.reason || 'Rejected by sanction team';
  }
  await application.save();
  res.json({ application });
};

// DISBURSEMENT
export const getDisbursementQueue = async (_req: AuthRequest, res: Response): Promise<void> => {
  const applications = await LoanApplication.find({ status: 'sanctioned' })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json({ applications });
};

export const disburseLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const application = await LoanApplication.findById(req.params.id);
  if (!application || application.status !== 'sanctioned') {
    res.status(404).json({ message: 'Application not found or not sanctioned' });
    return;
  }
  application.status = 'disbursed';
  await application.save();
  res.json({ application });
};

// COLLECTION
export const getCollectionQueue = async (_req: AuthRequest, res: Response): Promise<void> => {
  const applications = await LoanApplication.find({ status: { $in: ['disbursed', 'closed'] } })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  const appIds = applications.map((a) => a._id);
  const payments = await Payment.find({ loanApplicationId: { $in: appIds } });

  const paymentMap: Record<string, typeof payments> = {};
  payments.forEach((p) => {
    const key = p.loanApplicationId.toString();
    if (!paymentMap[key]) paymentMap[key] = [];
    paymentMap[key].push(p);
  });

  const result = applications.map((app) => ({
    ...app.toObject(),
    payments: paymentMap[app.id] || [],
  }));

  res.json({ applications: result });
};

const paymentSchema = z.object({
  utr: z.string().min(1),
  amount: z.number().min(1),
  date: z.string().min(1),
});

export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const application = await LoanApplication.findById(req.params.id);
  if (!application || application.status !== 'disbursed') {
    res.status(404).json({ message: 'Loan not found or not in disbursed state' });
    return;
  }

  const existingUTR = await Payment.findOne({ utr: parsed.data.utr });
  if (existingUTR) {
    res.status(409).json({ message: 'UTR already exists. Duplicate payment.' });
    return;
  }

  const payment = await Payment.create({
    loanApplicationId: application._id,
    utr: parsed.data.utr,
    amount: parsed.data.amount,
    date: parsed.data.date,
    recordedBy: req.user!.id,
  });

  // Auto-close if fully paid
  const allPayments = await Payment.find({ loanApplicationId: application._id });
  const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
  if (application.loanConfig && totalPaid >= application.loanConfig.totalRepayment) {
    application.status = 'closed';
    await application.save();
  }

  res.status(201).json({ payment, loanStatus: application.status });
};

export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  const payments = await Payment.find({ loanApplicationId: req.params.id }).sort({ createdAt: -1 });
  res.json({ payments });
};

// ADMIN
export const getAllApplications = async (_req: AuthRequest, res: Response): Promise<void> => {
  const applications = await LoanApplication.find()
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });
  res.json({ applications });
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await (await import('../models/User')).default
    .find()
    .select('-password')
    .sort({ createdAt: -1 });
  res.json({ users });
};
