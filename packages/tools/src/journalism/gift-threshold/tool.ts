import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly giftValue: number;
  readonly policyThreshold: number;
  readonly giftReturned: boolean;
}>;
export type Output = Readonly<{
  readonly amountAboveThreshold: number;
  readonly thresholdExceeded: boolean;
  readonly recommendedAction: string;
}>;

export const calculate = (input: Input): Output => {
  const thresholdExceeded = input.giftValue > input.policyThreshold;
  return {
    amountAboveThreshold: Math.max(0, input.giftValue - input.policyThreshold),
    thresholdExceeded,
    recommendedAction: input.giftReturned
      ? "record"
      : thresholdExceeded
        ? "disclose"
        : "no-action",
  };
};

export const exampleInput = {
  giftValue: 150,
  policyThreshold: 100,
  giftReturned: false,
} satisfies Input;
export const exampleOutput = {
  amountAboveThreshold: 50,
  thresholdExceeded: true,
  recommendedAction: "disclose",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      giftValue: input.giftValue as number,
      policyThreshold: input.policyThreshold as number,
      giftReturned: input.giftReturned as boolean,
    }),
  description:
    "Compare a gift value with a caller-supplied newsroom threshold.",
  id: "journalism/gift-threshold",
  inputs: [
    { id: "giftValue", label: "Gift value", kind: "number", minimum: 0 },
    {
      id: "policyThreshold",
      label: "Policy threshold",
      kind: "number",
      minimum: 0,
    },
    { id: "giftReturned", label: "Gift was returned", kind: "boolean" },
  ],
  outputs: [
    {
      id: "amountAboveThreshold",
      label: "Amount above threshold",
      kind: "number",
      minimum: 0,
    },
    { id: "thresholdExceeded", label: "Threshold exceeded", kind: "boolean" },
    {
      id: "recommendedAction",
      label: "Recommended action",
      kind: "string",
      enum: ["record", "disclose", "no-action"],
    },
  ],
  title: "Gift Threshold",
});

export const run = tool.execute;
export default tool;
