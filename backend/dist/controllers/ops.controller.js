"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getAllApplications = exports.getPayments = exports.recordPayment = exports.getCollectionQueue = exports.disburseLoan = exports.getDisbursementQueue = exports.sanctionLoan = exports.getSanctionQueue = exports.getLeads = void 0;
const zod_1 = require("zod");
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const Payment_1 = __importDefault(require("../models/Payment"));
// SALES
const getLeads = async (req, res) => {
    const applications = await LoanApplication_1.default.find({ status: { $in: ['lead', 'applied'] } })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json({ applications });
};
exports.getLeads = getLeads;
// SANCTION
const getSanctionQueue = async (_req, res) => {
    const applications = await LoanApplication_1.default.find({ status: 'applied' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json({ applications });
};
exports.getSanctionQueue = getSanctionQueue;
const sanctionSchema = zod_1.z.object({
    action: zod_1.z.enum(['approve', 'reject']),
    reason: zod_1.z.string().optional(),
});
const sanctionLoan = async (req, res) => {
    const parsed = sanctionSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid action' });
        return;
    }
    const application = await LoanApplication_1.default.findById(req.params.id);
    if (!application || application.status !== 'applied') {
        res.status(404).json({ message: 'Application not found or not in applied state' });
        return;
    }
    if (parsed.data.action === 'approve') {
        application.status = 'sanctioned';
    }
    else {
        application.status = 'rejected';
        application.rejectionReason = parsed.data.reason || 'Rejected by sanction team';
    }
    await application.save();
    res.json({ application });
};
exports.sanctionLoan = sanctionLoan;
// DISBURSEMENT
const getDisbursementQueue = async (_req, res) => {
    const applications = await LoanApplication_1.default.find({ status: 'sanctioned' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    res.json({ applications });
};
exports.getDisbursementQueue = getDisbursementQueue;
const disburseLoan = async (req, res) => {
    const application = await LoanApplication_1.default.findById(req.params.id);
    if (!application || application.status !== 'sanctioned') {
        res.status(404).json({ message: 'Application not found or not sanctioned' });
        return;
    }
    application.status = 'disbursed';
    await application.save();
    res.json({ application });
};
exports.disburseLoan = disburseLoan;
// COLLECTION
const getCollectionQueue = async (_req, res) => {
    const applications = await LoanApplication_1.default.find({ status: { $in: ['disbursed', 'closed'] } })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    const appIds = applications.map((a) => a._id);
    const payments = await Payment_1.default.find({ loanApplicationId: { $in: appIds } });
    const paymentMap = {};
    payments.forEach((p) => {
        const key = p.loanApplicationId.toString();
        if (!paymentMap[key])
            paymentMap[key] = [];
        paymentMap[key].push(p);
    });
    const result = applications.map((app) => ({
        ...app.toObject(),
        payments: paymentMap[app.id] || [],
    }));
    res.json({ applications: result });
};
exports.getCollectionQueue = getCollectionQueue;
const paymentSchema = zod_1.z.object({
    utr: zod_1.z.string().min(1),
    amount: zod_1.z.number().min(1),
    date: zod_1.z.string().min(1),
});
const recordPayment = async (req, res) => {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const application = await LoanApplication_1.default.findById(req.params.id);
    if (!application || application.status !== 'disbursed') {
        res.status(404).json({ message: 'Loan not found or not in disbursed state' });
        return;
    }
    const existingUTR = await Payment_1.default.findOne({ utr: parsed.data.utr });
    if (existingUTR) {
        res.status(409).json({ message: 'UTR already exists. Duplicate payment.' });
        return;
    }
    const payment = await Payment_1.default.create({
        loanApplicationId: application._id,
        utr: parsed.data.utr,
        amount: parsed.data.amount,
        date: parsed.data.date,
        recordedBy: req.user.id,
    });
    // Auto-close if fully paid
    const allPayments = await Payment_1.default.find({ loanApplicationId: application._id });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
    if (application.loanConfig && totalPaid >= application.loanConfig.totalRepayment) {
        application.status = 'closed';
        await application.save();
    }
    res.status(201).json({ payment, loanStatus: application.status });
};
exports.recordPayment = recordPayment;
const getPayments = async (req, res) => {
    const payments = await Payment_1.default.find({ loanApplicationId: req.params.id }).sort({ createdAt: -1 });
    res.json({ payments });
};
exports.getPayments = getPayments;
// ADMIN
const getAllApplications = async (_req, res) => {
    const applications = await LoanApplication_1.default.find()
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
    res.json({ applications });
};
exports.getAllApplications = getAllApplications;
const getAllUsers = async (_req, res) => {
    const users = await (await Promise.resolve().then(() => __importStar(require('../models/User')))).default
        .find()
        .select('-password')
        .sort({ createdAt: -1 });
    res.json({ users });
};
exports.getAllUsers = getAllUsers;
