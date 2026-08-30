import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly startDay: number;
  readonly revisitGapsDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly revisitDays: readonly number[];
  readonly totalSpanDays: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.startDay) ||
    !input.revisitGapsDays.length ||
    input.revisitGapsDays.some((v) => !Number.isSafeInteger(v) || v < 1)
  )
    simpleError("revisitGapsDays", "Positive integer revisit gaps required.");
  let day = input.startDay;
  const revisitDays = input.revisitGapsDays.map((gap) => (day += gap));
  return { revisitDays, totalSpanDays: day - input.startDay };
};
export const exampleInput = {
  startDay: 0,
  revisitGapsDays: [2, 4, 7],
} satisfies Input;
export const exampleOutput = {
  revisitDays: [2, 6, 13],
  totalSpanDays: 13,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/spiral-review-intervals",
  title: "Spiral Review Intervals",
  description:
    "Map successive curriculum revisits from caller-chosen spacing intervals.",
  inputs: [
    { id: "startDay", label: "Start day", kind: "number" },
    { id: "revisitGapsDays", label: "Revisit gaps days", kind: "numberList" },
  ],
  outputs: [
    { id: "revisitDays", label: "Revisit days", kind: "numberList" },
    { id: "totalSpanDays", label: "Total span days", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startDay: value.startDay as number,
      revisitGapsDays: value.revisitGapsDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
