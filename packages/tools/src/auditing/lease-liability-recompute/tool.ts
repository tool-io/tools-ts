import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly periodicPayment: number;
  readonly periodicDiscountRatePercent: number;
  readonly remainingPeriods: number;
  readonly reportedLiability: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly recomputedLiability: number;
  readonly difference: number;
  readonly withinTolerance: boolean;
}>;

export const calculate = (input: Input): Output => {
  const r = input.periodicDiscountRatePercent / 100,
    recomputedLiability =
      r === 0
        ? input.periodicPayment * input.remainingPeriods
        : (input.periodicPayment * (1 - (1 + r) ** -input.remainingPeriods)) /
          r;
  const difference = input.reportedLiability - recomputedLiability;
  return {
    recomputedLiability,
    difference,
    withinTolerance: Math.abs(difference) <= input.tolerance,
  };
};

export const exampleInput = {
  periodicPayment: 100,
  periodicDiscountRatePercent: 0,
  remainingPeriods: 10,
  reportedLiability: 1000,
  tolerance: 0,
} satisfies Input;
export const exampleOutput = {
  recomputedLiability: 1000,
  difference: 0,
  withinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      periodicPayment: input.periodicPayment as number,
      periodicDiscountRatePercent: input.periodicDiscountRatePercent as number,
      remainingPeriods: input.remainingPeriods as number,
      reportedLiability: input.reportedLiability as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Recompute a fixed-payment lease liability and compare it with the reported amount.",
  id: "auditing/lease-liability-recompute",
  inputs: [
    {
      id: "periodicPayment",
      label: "Periodic lease payment",
      kind: "number",
      minimum: 0,
    },
    {
      id: "periodicDiscountRatePercent",
      label: "Periodic discount rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "remainingPeriods",
      label: "Remaining payment periods",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "reportedLiability",
      label: "Reported lease liability",
      kind: "number",
      minimum: 0,
    },
    {
      id: "tolerance",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "recomputedLiability",
      label: "Recomputed lease liability",
      kind: "number",
      minimum: 0,
    },
    {
      id: "difference",
      label: "Reported minus recomputed liability",
      kind: "number",
    },
    {
      id: "withinTolerance",
      label: "Within supplied tolerance",
      kind: "boolean",
    },
  ],
  title: "Lease Liability Recompute",
});

export const run = tool.execute;
export default tool;
