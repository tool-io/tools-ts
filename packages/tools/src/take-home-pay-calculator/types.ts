export const payPeriods = [
  "yearly",
  "monthly",
  "semimonthly",
  "biweekly",
  "weekly",
] as const;

export type PayPeriod = (typeof payPeriods)[number];

export const periodsPerYear: Readonly<Record<PayPeriod, number>> = {
  yearly: 1,
  monthly: 12,
  semimonthly: 24,
  biweekly: 26,
  weekly: 52,
};

export type TakeHomePayBaseInput = {
  readonly grossPay: number;
  readonly payPeriod: PayPeriod;
};

export type TakeHomePayDeduction = {
  readonly amount: number;
  readonly code: string;
  readonly label: string;
};

export type TakeHomePayOutput = {
  readonly assumptions: readonly string[];
  readonly country: string;
  readonly currency: string;
  readonly deductions: readonly TakeHomePayDeduction[];
  readonly grossAnnual: number;
  readonly locale: string;
  readonly location: string;
  readonly netAnnual: number;
  readonly netForPeriod: number;
  readonly period: PayPeriod;
  readonly ruleVersion: string;
  readonly taxYear: string;
  readonly warnings: readonly string[];
};
