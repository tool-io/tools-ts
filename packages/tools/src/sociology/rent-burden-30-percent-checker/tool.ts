import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentBurden30PercentCheckerInput = {
  readonly monthlyGrossIncome: number;
  readonly monthlyRent: number;
};

export type RentBurden30PercentCheckerOutput = {
  readonly burdenPercent: number;
  readonly rentBurdened: boolean;
};

export const rentBurden30PercentCheckerExample = {
  input: {
    monthlyGrossIncome: 3000,
    monthlyRent: 1100,
  },
  output: {
    burdenPercent: 36.666666666666664,
    rentBurdened: true,
  },
} satisfies ToolExample<
  RentBurden30PercentCheckerInput,
  RentBurden30PercentCheckerOutput
>;

const BURDEN_THRESHOLD_PERCENT = 30;

export const calculateRentBurden = (
  input: RentBurden30PercentCheckerInput,
): RentBurden30PercentCheckerOutput => {
  if (
    !Number.isFinite(input.monthlyGrossIncome) ||
    input.monthlyGrossIncome <= 0
  )
    simpleError(
      "monthlyGrossIncome",
      "Household income must be positive to measure the burden.",
      "invalid_value",
    );
  if (!Number.isFinite(input.monthlyRent) || input.monthlyRent < 0)
    simpleError(
      "monthlyRent",
      "Monthly rent must be a finite nonnegative number.",
      "invalid_value",
    );
  const burdenPercent = (input.monthlyRent / input.monthlyGrossIncome) * 100;
  if (!Number.isFinite(burdenPercent))
    simpleError(
      "monthlyRent",
      "The rent-burden percentage is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    burdenPercent,
    rentBurdened: burdenPercent >= BURDEN_THRESHOLD_PERCENT,
  };
};

export const rentBurden30PercentCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateRentBurden({
      monthlyGrossIncome: input.monthlyGrossIncome as number,
      monthlyRent: input.monthlyRent as number,
    }),
  description:
    "Flag rent-burdened households spending at least thirty percent of gross income on rent.",
  id: "sociology/rent-burden-30-percent-checker",
  inputs: [
    {
      description: "Household gross income per month.",
      id: "monthlyGrossIncome",
      kind: "number",
      label: "Monthly income",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Contract rent paid per month.",
      id: "monthlyRent",
      kind: "number",
      label: "Monthly rent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Rent as a share of gross income.",
      id: "burdenPercent",
      kind: "number",
      label: "Rent burden",
      unit: "%",
    },
    {
      description: "Whether the share is at least thirty percent.",
      id: "rentBurdened",
      kind: "boolean",
      label: "Rent burdened",
    },
  ],
  title: "Rent Burden 30% Checker",
});
export const runRentBurden30PercentChecker =
  rentBurden30PercentCheckerTool.execute;
export default rentBurden30PercentCheckerTool;
