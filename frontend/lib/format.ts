export function money(value = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function compactDate(value?: string) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export function calculateLoan(amount: number, tenureDays: number) {
  const interestRate = 12;
  const simpleInterest = (amount * interestRate * tenureDays) / (365 * 100);
  return {
    amount,
    tenureDays,
    interestRate,
    simpleInterest: Number(simpleInterest.toFixed(2)),
    totalRepayment: Number((amount + simpleInterest).toFixed(2)),
  };
}
