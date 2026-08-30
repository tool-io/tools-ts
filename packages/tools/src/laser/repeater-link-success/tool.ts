import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly elementaryLinkSuccessProbability: number;
  readonly elementaryLinkCount: number;
  readonly attemptCount: number;
}>;
export type Output = Readonly<{
  readonly singleAttemptChainProbability: number;
  readonly cumulativeSuccessProbability: number;
  readonly expectedAttempts: number;
}>;

export const calculate = (input: Input): Output => {
  const singleAttemptChainProbability =
    input.elementaryLinkSuccessProbability ** input.elementaryLinkCount;
  return {
    singleAttemptChainProbability,
    cumulativeSuccessProbability:
      1 - (1 - singleAttemptChainProbability) ** input.attemptCount,
    expectedAttempts:
      singleAttemptChainProbability === 0
        ? 0
        : 1 / singleAttemptChainProbability,
  };
};

export const exampleInput = {
  elementaryLinkSuccessProbability: 0.5,
  elementaryLinkCount: 2,
  attemptCount: 3,
} satisfies Input;
export const exampleOutput = {
  singleAttemptChainProbability: 0.25,
  cumulativeSuccessProbability: 0.578125,
  expectedAttempts: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      elementaryLinkSuccessProbability:
        input.elementaryLinkSuccessProbability as number,
      elementaryLinkCount: input.elementaryLinkCount as number,
      attemptCount: input.attemptCount as number,
    }),
  description:
    "Estimate independent quantum-repeater chain success across repeated attempts.",
  id: "laser/repeater-link-success",
  inputs: [
    {
      id: "elementaryLinkSuccessProbability",
      label: "Elementary-link success probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "elementaryLinkCount",
      label: "Elementary-link count",
      kind: "integer",
      minimum: 1,
    },
    { id: "attemptCount", label: "Attempt count", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "singleAttemptChainProbability",
      label: "Single-attempt chain probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "cumulativeSuccessProbability",
      label: "Cumulative success probability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "expectedAttempts",
      label: "Expected attempts",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Repeater-Link Success",
});

export const run = tool.execute;
export default tool;
