export const ukIncomeTaxBrackets2026 = (personalAllowance: number) =>
  [
    { rate: 0.2, upTo: 37_700 },
    { rate: 0.4, upTo: 125_140 - personalAllowance },
    { rate: 0.45, upTo: null },
  ] as const;

export const ukPersonalAllowance2026 = (adjustedIncome: number): number =>
  Math.max(0, 12_570 - Math.max(0, adjustedIncome - 100_000) / 2);
