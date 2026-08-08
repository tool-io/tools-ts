export const newZealandTaxBrackets2026 = [
  { rate: 0.105, upTo: 15_600 },
  { rate: 0.175, upTo: 53_500 },
  { rate: 0.3, upTo: 78_100 },
  { rate: 0.33, upTo: 180_000 },
  { rate: 0.39, upTo: null },
] as const;

export const newZealandPayrollRules2026 = {
  accAssessmentCeiling: 156_641,
  accEarnersLevyRate: 0.0175,
  studentLoanRate: 0.12,
  studentLoanThreshold: 24_128,
} as const;
