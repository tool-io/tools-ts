import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly claimSettlement: number;
  readonly feeRatePercent: number;
  readonly feeCap: number;
  readonly retainerPaid: number;
}>;
export type Output = Readonly<{
  readonly uncappedFee: number;
  readonly cappedFee: number;
  readonly balanceDue: number;
  readonly capSavings: number;
}>;

export const calculate = (input: Input): Output => {
  const uncappedFee = (input.claimSettlement * input.feeRatePercent) / 100,
    cappedFee = Math.min(uncappedFee, input.feeCap);
  return {
    uncappedFee,
    cappedFee,
    balanceDue: Math.max(0, cappedFee - input.retainerPaid),
    capSavings: uncappedFee - cappedFee,
  };
};

export const exampleInput = {
  claimSettlement: 100000,
  feeRatePercent: 10,
  feeCap: 8000,
  retainerPaid: 1000,
} satisfies Input;
export const exampleOutput = {
  uncappedFee: 10000,
  cappedFee: 8000,
  balanceDue: 7000,
  capSavings: 2000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      claimSettlement: input.claimSettlement as number,
      feeRatePercent: input.feeRatePercent as number,
      feeCap: input.feeCap as number,
      retainerPaid: input.retainerPaid as number,
    }),
  description: "Apply a caller-supplied public-adjuster fee rate and cap.",
  id: "insurance/adjuster-fee-cap",
  inputs: [
    {
      id: "claimSettlement",
      label: "Claim settlement",
      kind: "number",
      minimum: 0,
    },
    {
      id: "feeRatePercent",
      label: "Adjuster fee rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "feeCap", label: "Caller fee cap", kind: "number", minimum: 0 },
    { id: "retainerPaid", label: "Retainer paid", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "uncappedFee",
      label: "Uncapped adjuster fee",
      kind: "number",
      minimum: 0,
    },
    {
      id: "cappedFee",
      label: "Capped adjuster fee",
      kind: "number",
      minimum: 0,
    },
    { id: "balanceDue", label: "Fee balance due", kind: "number", minimum: 0 },
    {
      id: "capSavings",
      label: "Savings from fee cap",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Adjuster Fee Cap",
});

export const run = tool.execute;
export default tool;
