import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly baselineHrvMs: readonly number[];
  readonly currentHrvMs: number;
  readonly allowedDropFraction: number;
}>;
export type Output = Readonly<{
  readonly baselineMeanMs: number;
  readonly lowerBoundMs: number;
  readonly belowBaseline: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.baselineHrvMs.length !== 7 ||
    input.baselineHrvMs.some((v) => v <= 0) ||
    input.currentHrvMs <= 0 ||
    input.allowedDropFraction < 0 ||
    input.allowedDropFraction >= 1
  )
    simpleError(
      "baselineHrvMs",
      "Seven positive baseline HRV values and valid drop fraction required.",
    );
  const baselineMeanMs = input.baselineHrvMs.reduce((a, b) => a + b, 0) / 7,
    lowerBoundMs = baselineMeanMs * (1 - input.allowedDropFraction);
  return {
    baselineMeanMs,
    lowerBoundMs,
    belowBaseline: input.currentHrvMs < lowerBoundMs,
  };
};
export const exampleInput = {
  baselineHrvMs: [50, 50, 50, 50, 50, 50, 50],
  currentHrvMs: 45,
  allowedDropFraction: 0.08,
} satisfies Input;
export const exampleOutput = {
  baselineMeanMs: 50,
  lowerBoundMs: 46,
  belowBaseline: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/hrv-rolling-baseline",
  title: "HRV Rolling Baseline",
  description:
    "Compare current HRV with the prior seven-day mean and caller tolerance.",
  inputs: [
    { id: "baselineHrvMs", label: "Baseline hrv ms", kind: "numberList" },
    { id: "currentHrvMs", label: "Current hrv ms", kind: "number" },
    {
      id: "allowedDropFraction",
      label: "Allowed drop fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "baselineMeanMs", label: "Baseline mean ms", kind: "number" },
    { id: "lowerBoundMs", label: "Lower bound ms", kind: "number" },
    { id: "belowBaseline", label: "Below baseline", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      baselineHrvMs: value.baselineHrvMs as readonly number[],
      currentHrvMs: value.currentHrvMs as number,
      allowedDropFraction: value.allowedDropFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
