export const germanIncomeTax2026 = (income: number): number => {
  const x = Math.floor(Math.max(0, income));
  if (x <= 12_348) return 0;
  if (x <= 17_799) {
    const y = (x - 12_348) / 10_000;
    return (914.51 * y + 1_400) * y;
  }
  if (x <= 69_878) {
    const z = (x - 17_799) / 10_000;
    return (173.1 * z + 2_397) * z + 1_034.87;
  }
  if (x <= 277_825) return 0.42 * x - 11_135.63;
  return 0.45 * x - 19_470.38;
};

export const germanPayrollRules2026 = {
  careEmployeeRateWithChildren: 0.018,
  careEmployeeRateWithoutChildren: 0.024,
  employeeExpenseAllowance: 1_230,
  healthAssessmentCeiling: 69_750,
  healthEmployeeRate: 0.073 + 0.0145,
  pensionAssessmentCeiling: 101_400,
  pensionEmployeeRate: 0.093,
  solidarityExemption: 20_350,
  solidarityPhaseInRate: 0.119,
  solidarityRate: 0.055,
  specialExpenseAllowance: 36,
  unemploymentEmployeeRate: 0.013,
} as const;
