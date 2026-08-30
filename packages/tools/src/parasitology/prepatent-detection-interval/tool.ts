import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly infectionDay: number;
  readonly firstPositiveDay: number;
  readonly lastNegativeDay: number;
}>;
export type Output = Readonly<{
  readonly firstPositiveIntervalDays: number;
  readonly lastNegativeIntervalDays: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.infectionDay, "infectionDay");
  if (
    input.lastNegativeDay < input.infectionDay ||
    input.firstPositiveDay <= input.lastNegativeDay
  )
    simpleError(
      "firstPositiveDay",
      "Last negative must precede first positive and follow estimated infection day.",
    );
  return {
    firstPositiveIntervalDays: input.firstPositiveDay - input.infectionDay,
    lastNegativeIntervalDays: input.lastNegativeDay - input.infectionDay,
  };
};
export const exampleInput = {
  infectionDay: 2,
  firstPositiveDay: 12,
  lastNegativeDay: 9,
} satisfies Input;
export const exampleOutput = {
  firstPositiveIntervalDays: 10,
  lastNegativeIntervalDays: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/prepatent-detection-interval",
  title: "Prepatent Detection Interval",
  description:
    "Bracket observed prepatent detection delay from estimated infection and last-negative/first-positive observations.",
  inputs: [
    { id: "infectionDay", label: "Infection day", kind: "number" },
    { id: "firstPositiveDay", label: "First positive day", kind: "number" },
    { id: "lastNegativeDay", label: "Last negative day", kind: "number" },
  ],
  outputs: [
    {
      id: "firstPositiveIntervalDays",
      label: "First positive interval days",
      kind: "number",
    },
    {
      id: "lastNegativeIntervalDays",
      label: "Last negative interval days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      infectionDay: value.infectionDay as number,
      firstPositiveDay: value.firstPositiveDay as number,
      lastNegativeDay: value.lastNegativeDay as number,
    }),
});
export const run = tool.execute;
export default tool;
