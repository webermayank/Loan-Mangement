export interface LoanCalculation {
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
}

export function calculateLoan(amount: number, tenureDays: number): LoanCalculation {
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
