export const japanEmploymentIncome2026 = (salary: number): number => {
  if (salary <= 650_999) return 0;
  if (salary <= 1_899_999) return salary - 650_000;
  const quarter = Math.floor(salary / 4 / 1_000) * 1_000;
  if (salary <= 3_599_999) return quarter * 2.8 - 80_000;
  if (salary <= 6_599_999) return quarter * 3.2 - 440_000;
  if (salary <= 8_499_999) return salary * 0.9 - 1_100_000;
  return salary - 1_950_000;
};

export const japanBasicExemption2026 = (income: number): number => {
  if (income <= 1_320_000) return 950_000;
  if (income <= 3_360_000) return 880_000;
  if (income <= 4_890_000) return 680_000;
  if (income <= 6_550_000) return 630_000;
  if (income <= 23_500_000) return 580_000;
  if (income <= 24_000_000) return 480_000;
  if (income <= 24_500_000) return 320_000;
  if (income <= 25_000_000) return 160_000;
  return 0;
};

export const japanNationalIncomeTax2026 = (income: number): number => {
  if (income <= 1_950_000) return income * 0.05;
  if (income <= 3_300_000) return income * 0.1 - 97_500;
  if (income <= 6_950_000) return income * 0.2 - 427_500;
  if (income <= 9_000_000) return income * 0.23 - 636_000;
  if (income <= 18_000_000) return income * 0.33 - 1_536_000;
  if (income <= 40_000_000) return income * 0.4 - 2_796_000;
  return income * 0.45 - 4_796_000;
};
