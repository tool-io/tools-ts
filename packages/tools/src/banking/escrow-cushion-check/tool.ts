import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualDisbursements: number;
  readonly projectedMinimumBalance: number;
  readonly maximumCushionMonths: number;
}>;
export type Output = Readonly<{
  readonly allowedCushion: number;
  readonly actualCushionMonths: number;
  readonly withinCallerLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const monthlyDisbursement = input.annualDisbursements / 12;
  const allowedCushion = monthlyDisbursement * input.maximumCushionMonths;
  const actualCushionMonths =
    monthlyDisbursement === 0
      ? 0
      : input.projectedMinimumBalance / monthlyDisbursement;
  return {
    allowedCushion,
    actualCushionMonths,
    withinCallerLimit: input.projectedMinimumBalance <= allowedCushion,
  };
};

export const exampleInput = {
  annualDisbursements: 6000,
  projectedMinimumBalance: 900,
  maximumCushionMonths: 2,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  annualDisbursements: 0,
  projectedMinimumBalance: 0,
  maximumCushionMonths: 2,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualDisbursements: input.annualDisbursements as number,
      projectedMinimumBalance: input.projectedMinimumBalance as number,
      maximumCushionMonths: input.maximumCushionMonths as number,
    }),
  description:
    "Compare a projected escrow cushion with a caller-supplied month limit.",
  id: "banking/escrow-cushion-check",
  inputs: [
    {
      id: "annualDisbursements",
      label: "Annual disbursements",
      kind: "number",
      minimum: 0,
      unit: "currency/year",
    },
    {
      id: "projectedMinimumBalance",
      label: "Projected minimum balance",
      kind: "number",
      unit: "currency",
    },
    {
      id: "maximumCushionMonths",
      label: "Maximum cushion",
      kind: "number",
      minimum: 0,
      unit: "months",
    },
  ],
  outputs: [
    {
      id: "allowedCushion",
      label: "Allowed cushion",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "actualCushionMonths",
      label: "Actual cushion",
      kind: "number",
      unit: "months",
    },
    { id: "withinCallerLimit", label: "Within caller limit", kind: "boolean" },
  ],
  title: "Escrow Cushion Check",
});

export const run = tool.execute;
export default tool;
