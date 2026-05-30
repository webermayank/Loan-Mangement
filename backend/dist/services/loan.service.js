"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLoan = calculateLoan;
function calculateLoan(amount, tenureDays) {
    const interestRate = 12;
    const simpleInterest = (amount * interestRate * tenureDays) / (365 * 100);
    const totalRepayment = amount + simpleInterest;
    return {
        amount,
        tenureDays,
        interestRate,
        simpleInterest: parseFloat(simpleInterest.toFixed(2)),
        totalRepayment: parseFloat(totalRepayment.toFixed(2)),
    };
}
