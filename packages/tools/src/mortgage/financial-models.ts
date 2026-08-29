import { simpleError } from "../core/simple.js";

export const monthlyPayment = (
  principal: number,
  annualRatePercent: number,
  months: number,
): number => {
  if (!(principal > 0) || !Number.isFinite(principal))
    simpleError("principal", "Principal must be finite and positive.");
  if (!(months > 0) || !Number.isSafeInteger(months))
    simpleError("months", "Term must be a positive whole number of months.");
  if (annualRatePercent < 0 || !Number.isFinite(annualRatePercent))
    simpleError("annualRatePercent", "Annual rate must be nonnegative.");
  const rate = annualRatePercent / 1200;
  const value =
    rate === 0
      ? principal / months
      : (principal * rate) / -Math.expm1(-months * Math.log1p(rate));
  if (!Number.isFinite(value))
    simpleError("principal", "Payment is outside the finite number range.");
  return value;
};

export const remainingBalance = (
  principal: number,
  annualRatePercent: number,
  monthly: number,
  elapsedMonths: number,
): number => {
  const rate = annualRatePercent / 1200;
  const balance =
    rate === 0
      ? principal - monthly * elapsedMonths
      : principal * (1 + rate) ** elapsedMonths -
        (monthly * Math.expm1(elapsedMonths * Math.log1p(rate))) / rate;
  if (!Number.isFinite(balance))
    simpleError("principal", "Balance is outside the finite number range.");
  return Math.max(0, balance);
};
