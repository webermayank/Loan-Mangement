"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplication = exports.applyForLoan = exports.saveLoanConfig = exports.uploadSalarySlip = exports.savePersonalDetails = void 0;
const zod_1 = require("zod");
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const bre_service_1 = require("../services/bre.service");
const loan_service_1 = require("../services/loan.service");
const personalDetailsSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    pan: zod_1.z.string().regex(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/, 'Invalid PAN format'),
    dob: zod_1.z.string().min(1),
    monthlySalary: zod_1.z.number().min(0),
    employmentMode: zod_1.z.enum(['salaried', 'self-employed', 'unemployed']),
});
const loanConfigSchema = zod_1.z.object({
    amount: zod_1.z.number().min(50000).max(500000),
    tenureDays: zod_1.z.number().min(30).max(365),
});
const savePersonalDetails = async (req, res) => {
    const parsed = personalDetailsSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const details = parsed.data;
    const breResult = (0, bre_service_1.runBRE)({
        pan: details.pan.toUpperCase(),
        dob: details.dob,
        monthlySalary: details.monthlySalary,
        employmentMode: details.employmentMode,
    });
    let application = await LoanApplication_1.default.findOne({ userId: req.user.id });
    if (application) {
        application.personalDetails = { ...details, pan: details.pan.toUpperCase() };
        application.breResult = breResult;
        application.status = 'lead';
        await application.save();
    }
    else {
        application = await LoanApplication_1.default.create({
            userId: req.user.id,
            personalDetails: { ...details, pan: details.pan.toUpperCase() },
            breResult,
            status: 'lead',
        });
    }
    res.json({ application, breResult });
};
exports.savePersonalDetails = savePersonalDetails;
const uploadSalarySlip = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const application = await LoanApplication_1.default.findOne({ userId: req.user.id });
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
exports.uploadSalarySlip = uploadSalarySlip;
const saveLoanConfig = async (req, res) => {
    const parsed = loanConfigSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const application = await LoanApplication_1.default.findOne({ userId: req.user.id });
    if (!application) {
        res.status(404).json({ message: 'Application not found' });
        return;
    }
    if (!application.salarySlipUrl) {
        res.status(400).json({ message: 'Upload salary slip first' });
        return;
    }
    const calc = (0, loan_service_1.calculateLoan)(parsed.data.amount, parsed.data.tenureDays);
    application.loanConfig = calc;
    await application.save();
    res.json({ loanConfig: application.loanConfig });
};
exports.saveLoanConfig = saveLoanConfig;
const applyForLoan = async (req, res) => {
    const application = await LoanApplication_1.default.findOne({ userId: req.user.id });
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
exports.applyForLoan = applyForLoan;
const getMyApplication = async (req, res) => {
    const application = await LoanApplication_1.default.findOne({ userId: req.user.id }).lean();
    if (!application) {
        res.json({ application: null });
        return;
    }
    res.json({ application });
};
exports.getMyApplication = getMyApplication;
