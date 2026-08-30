import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { aligned, median } from "../shared.js";

export type Input = Readonly<{
  readonly sourceOnsetDays: readonly number[];
  readonly recipientOnsetDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly serialIntervalsDays: readonly number[];
  readonly medianSerialDays: number;
  readonly negativeIntervalCount: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.sourceOnsetDays, input.recipientOnsetDays, "sourceOnsetDays");
  const serialIntervalsDays = input.sourceOnsetDays.map(
    (v, i) => input.recipientOnsetDays[i] - v,
  );
  return {
    serialIntervalsDays,
    medianSerialDays: median(serialIntervalsDays),
    negativeIntervalCount: serialIntervalsDays.filter((v) => v < 0).length,
  };
};
export const exampleInput = {
  sourceOnsetDays: [2, 5, 9],
  recipientOnsetDays: [5, 7, 8],
} satisfies Input;
export const exampleOutput = {
  serialIntervalsDays: [3, 2, -1],
  medianSerialDays: 2,
  negativeIntervalCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/serial-interval-onset-summary",
  title: "Serial Interval Onset Summary",
  description:
    "Summarize transmission-pair onset intervals without discarding negative serial intervals.",
  inputs: [
    { id: "sourceOnsetDays", label: "Source onset days", kind: "numberList" },
    {
      id: "recipientOnsetDays",
      label: "Recipient onset days",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "serialIntervalsDays",
      label: "Serial intervals days",
      kind: "numberList",
    },
    { id: "medianSerialDays", label: "Median serial days", kind: "number" },
    {
      id: "negativeIntervalCount",
      label: "Negative interval count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceOnsetDays: value.sourceOnsetDays as readonly number[],
      recipientOnsetDays: value.recipientOnsetDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
