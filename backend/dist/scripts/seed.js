"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("../config/db"));
const LoanApplication_1 = __importDefault(require("../models/LoanApplication"));
const Payment_1 = __importDefault(require("../models/Payment"));
const User_1 = __importDefault(require("../models/User"));
const loan_service_1 = require("../services/loan.service");
const bre_service_1 = require("../services/bre.service");
const password = 'Password@123';
const accounts = [
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
async function upsertUser(account) {
    let user = await User_1.default.findOne({ email: account.email });
    if (!user) {
        user = await User_1.default.create({ ...account, password });
        return user;
    }
    user.name = account.name;
    user.role = account.role;
    user.password = password;
    await user.save();
    return user;
}
async function createApplication(email, status) {
    const user = await User_1.default.findOne({ email });
    if (!user)
        return;
    const personalDetails = {
        fullName: user.name,
        pan: 'ABCDE1234F',
        dob: '1994-06-15',
        monthlySalary: 72000,
        employmentMode: 'salaried',
    };
    const loanConfig = (0, loan_service_1.calculateLoan)(status === 'disbursed' ? 180000 : 125000, status === 'disbursed' ? 120 : 90);
    await LoanApplication_1.default.create({
        userId: user._id,
        status,
        personalDetails,
        breResult: (0, bre_service_1.runBRE)(personalDetails),
        salarySlipUrl: '/uploads/demo-salary-slip.pdf',
        loanConfig,
        notes: [`Seeded ${status} application for evaluator walkthrough.`],
    });
}
async function seed() {
    await (0, db_1.default)();
    await Payment_1.default.deleteMany({});
    await LoanApplication_1.default.deleteMany({});
    for (const account of accounts) {
        await upsertUser(account);
    }
    await createApplication('demo.applied@lms.com', 'applied');
    await createApplication('demo.sanctioned@lms.com', 'sanctioned');
    await createApplication('demo.disbursed@lms.com', 'disbursed');
    console.table(accounts.map(({ role, email }) => ({ role, email, password })));
    await mongoose_1.default.disconnect();
}
seed().catch(async (error) => {
    console.error(error);
    await mongoose_1.default.disconnect();
    process.exit(1);
});
