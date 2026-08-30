import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly planWaitingDays: number;
  readonly creditableCoverageDays: number;
}>;
export type Output = Readonly<{
  readonly creditedDays: number;
  readonly remainingWaitingDays: number;
  readonly reductionPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const creditedDays = Math.min(
    input.planWaitingDays,
    input.creditableCoverageDays,
  );
  return {
    creditedDays,
    remainingWaitingDays: input.planWaitingDays - creditedDays,
    reductionPercent:
      input.planWaitingDays === 0
        ? 100
        : (creditedDays / input.planWaitingDays) * 100,
  };
};

export const exampleInput = {
  planWaitingDays: 90,
  creditableCoverageDays: 60,
} satisfies Input;
export const exampleOutput = {
  creditedDays: 60,
  remainingWaitingDays: 30,
  reductionPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      planWaitingDays: input.planWaitingDays as number,
      creditableCoverageDays: input.creditableCoverageDays as number,
    }),
  description: "Apply prior creditable coverage to a waiting period.",
  id: "insurance/waiting-period-credit",
  inputs: [
    {
      id: "planWaitingDays",
      label: "New plan waiting period",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "creditableCoverageDays",
      label: "Creditable prior coverage",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
  ],
  outputs: [
    {
      id: "creditedDays",
      label: "Credited waiting days",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "remainingWaitingDays",
      label: "Remaining waiting days",
      kind: "integer",
      minimum: 0,
      unit: "days",
    },
    {
      id: "reductionPercent",
      label: "Waiting-period reduction",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Waiting-Period Credit",
});

export const run = tool.execute;
export default tool;
