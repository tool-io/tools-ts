import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedIndex: number;
  readonly triggerIndex: number;
  readonly payoutPerIndexUnit: number;
  readonly maximumPayout: number;
  readonly triggerDirection: string;
}>;
export type Output = Readonly<{
  readonly triggerMagnitude: number;
  readonly payout: number;
  readonly triggered: boolean;
}>;

export const calculate = (input: Input): Output => {
  const triggerMagnitude =
    input.triggerDirection === "above"
      ? Math.max(0, input.observedIndex - input.triggerIndex)
      : Math.max(0, input.triggerIndex - input.observedIndex);
  return {
    triggerMagnitude,
    payout: Math.min(
      input.maximumPayout,
      triggerMagnitude * input.payoutPerIndexUnit,
    ),
    triggered: triggerMagnitude > 0,
  };
};

export const exampleInput = {
  observedIndex: 120,
  triggerIndex: 100,
  payoutPerIndexUnit: 1000,
  maximumPayout: 50000,
  triggerDirection: "above",
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  observedIndex: 90,
  triggerIndex: 100,
  payoutPerIndexUnit: 1000,
  maximumPayout: 50000,
  triggerDirection: "above",
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      observedIndex: input.observedIndex as number,
      triggerIndex: input.triggerIndex as number,
      payoutPerIndexUnit: input.payoutPerIndexUnit as number,
      maximumPayout: input.maximumPayout as number,
      triggerDirection: input.triggerDirection as string,
    }),
  description:
    "Calculate a parametric payout from a caller-defined trigger and cap.",
  id: "insurance/parametric-index-payout",
  inputs: [
    { id: "observedIndex", label: "Observed index", kind: "number" },
    { id: "triggerIndex", label: "Trigger index", kind: "number" },
    {
      id: "payoutPerIndexUnit",
      label: "Payout per index unit",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "maximumPayout",
      label: "Maximum payout",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "triggerDirection",
      label: "Trigger direction",
      kind: "string",
      enum: ["above", "below"],
    },
  ],
  outputs: [
    {
      id: "triggerMagnitude",
      label: "Trigger magnitude",
      kind: "number",
      minimum: 0,
    },
    {
      id: "payout",
      label: "Payout",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    { id: "triggered", label: "Triggered", kind: "boolean" },
  ],
  title: "Parametric Index Payout",
});

export const run = tool.execute;
export default tool;
