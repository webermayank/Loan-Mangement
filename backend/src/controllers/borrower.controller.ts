import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import LoanApplication from '../models/LoanApplication';
import { runBRE } from '../services/bre.service';
import { calculateLoan } from '../services/loan.service';

const personalDetailsSchema = z.object({
  fullName: z.string().min(2),
  pan: z.string().regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, 'Invalid PAN format'),
  dob: z.string().min(1),
  monthlySalary: z.number().min(0),
  employmentMode: z.enum(['salaried', 'self-employed', 'unemployed']),
});

const loanConfigSchema = z.object({
  amount: z.number().min(50000).max(500000),
  tenureDays: z.number().min(30).max(365),
});

export const savePersonalDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = personalDetailsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const details = parsed.data;
  const breResult = runBRE({
    pan: details.pan.toUpperCase(),
    dob: details.dob,
    monthlySalary: details.monthlySalary,
    employmentMode: details.employmentMode,
  });

  let application = await LoanApplication.findOne({ userId: req.user!.id });
  if (application) {
    application.personalDetails = { ...details, pan: details.pan.toUpperCase() };
    application.breResult = breResult;
    application.status = 'lead';
    await application.save();
  } else {
    application = await LoanApplication.create({
      userId: req.user!.id,
      personalDetails: { ...details, pan: details.pan.toUpperCase() },
      breResult,
      status: 'lead',
    });
  }

  res.json({ application, breResult });
};

export const uploadSalarySlip = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const application = await LoanApplication.findOne({ userId: req.user!.id });
  if (!application) {
    res.status(404).json({ message: 'Application not found. Complete personal details first.' });
    return;
  }
  if (!application.breResult?.eligible) {
    res.status(400).json({ message: 'BRE check failed. Not eligible for loan.' });
    return;
  }

  application.salarySlipUrl = `/uploads/${req.file.filename}`;
  await application.save();

  res.json({ salarySlipUrl: application.salarySlipUrl });
};

export const saveLoanConfig = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = loanConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const application = await LoanApplication.findOne({ userId: req.user!.id });
  if (!application) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }
  if (!application.salarySlipUrl) {
    res.status(400).json({ message: 'Upload salary slip first' });
    return;
  }

  const calc = calculateLoan(parsed.data.amount, parsed.data.tenureDays);
  application.loanConfig = calc;
  await application.save();

  res.json({ loanConfig: application.loanConfig });
};

export const applyForLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const application = await LoanApplication.findOne({ userId: req.user!.id });
  if (!application) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }
  if (!application.loanConfig) {
    res.status(400).json({ message: 'Configure loan details first' });
    return;
  }
  if (!application.breResult?.eligible) {
    res.status(400).json({ message: 'Not eligible to apply' });
    return;
  }
  if (application.status === 'applied') {
    res.status(400).json({ message: 'Already applied' });
    return;
  }

  application.status = 'applied';
  await application.save();

  res.json({ message: 'Loan application submitted successfully', application });
};

export const getMyApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  const application = await LoanApplication.findOne({ userId: req.user!.id }).lean();
  if (!application) {
    res.json({ application: null });
    return;
  }
  res.json({ application });
};
