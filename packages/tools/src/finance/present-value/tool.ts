import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PresentValueInput = {
  readonly futureValue?: number;
  readonly annualRatePercent?: number;
  readonly years?: number;
  readonly compoundingPerYear?: number;
};

export type PresentValueOutput = {
  readonly presentValueUsd: number;
};

export const calculatePresentValue = (
  input: PresentValueInput,
): PresentValueOutput => {
  const futureValue = input.futureValue ?? 20000;
  const annualRatePercent = input.annualRatePercent ?? 5;
  const years = input.years ?? 10;
  const periodsPerYear = input.compoundingPerYear ?? 1;
  const periodicRate = annualRatePercent / 100 / periodsPerYear;
  if (periodicRate <= -1)
    return simpleError(
      "annualRatePercent",
      "The discount rate per period must be greater than -100 percent.",
      "invalid_rate",
    );
  if (years < 0)
    return simpleError("years", "Years must not be negative.", "invalid_years");
  if (futureValue < 0)
    return simpleError(
      "futureValue",
      "Future value must not be negative.",
      "invalid_amount",
    );
  const presentValueUsd =
    futureValue / (1 + periodicRate) ** (years * periodsPerYear);
  if (!Number.isFinite(presentValueUsd))
    simpleError(
      "annualRatePercent",
      "The present value exceeds the numeric range.",
    );
  return { presentValueUsd };
};

export const presentValueExample = {
  input: {
    futureValue: 20000,
    annualRatePercent: 5,
    years: 10,
    compoundingPerYear: 1,
  },
  output: {
    presentValueUsd: 12278.265070815183,
  },
} satisfies ToolExample<PresentValueInput, PresentValueOutput>;

export const presentValueTool = createSimpleTool({
  id: "finance/present-value",
  title: "Present Value Calculator",
  description:
    "Discount a future value back to today using a nominal annual rate with periodic compounding.",
  inputs: [
    {
      description: "Amount to discount, in US dollars.",
      default: 20000,
      id: "futureValue",
      kind: "number",
      label: "Future value",
    },
    {
      description: "Nominal annual discount rate in percent.",
      default: 5,
      id: "annualRatePercent",
      kind: "number",
      label: "Annual rate",
    },
    {
      description: "Time horizon in years.",
      default: 10,
      id: "years",
      kind: "integer",
      label: "Years",
      minimum: 0,
    },
    {
      description: "Number of compounding periods per year.",
      default: 1,
      id: "compoundingPerYear",
      kind: "integer",
      label: "Compounding per year",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Discounted present value in US dollars.",
      id: "presentValueUsd",
      kind: "number",
      label: "Present value",
    },
  ],
  calculate: (input) =>
    calculatePresentValue({
      annualRatePercent: input.annualRatePercent as number,
      compoundingPerYear: input.compoundingPerYear as number,
      futureValue: input.futureValue as number,
      years: input.years as number,
    }),
});

export const runPresentValue = presentValueTool.execute;
export default presentValueTool;
