import { EmploymentMode } from '../models/LoanApplication';

interface PersonalDetails {
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface BREResult {
  eligible: boolean;
  reasons: string[];
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function getAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function runBRE(details: PersonalDetails): BREResult {
  const reasons: string[] = [];

  const age = getAge(details.dob);
  if (Number.isNaN(age) || age < 23 || age > 50) {
    reasons.push(`Age must be between 23 and 50 (yours: ${Number.isNaN(age) ? 'invalid DOB' : age})`);
  }

  if (details.monthlySalary < 25000) {
    reasons.push(`Monthly salary must be INR 25,000 or above (yours: INR ${details.monthlySalary.toLocaleString('en-IN')})`);
  }

  if (!PAN_REGEX.test(details.pan.toUpperCase())) {
    reasons.push('PAN format is invalid (expected: ABCDE1234F)');
  }

  if (details.employmentMode === 'unemployed') {
    reasons.push('Unemployed applicants are not eligible');
  }

  return { eligible: reasons.length === 0, reasons };
}
