import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly observationDays: readonly number[];
  readonly gametocyteCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstZeroDay: number;
  readonly lastPositiveDay: number;
  readonly noLaterRebound: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.observationDays, input.gametocyteCounts, "observationDays");
  input.observationDays.forEach((v, i) => {
    count(v, "observationDays");
    count(input.gametocyteCounts[i], "gametocyteCounts");
    if (i > 0 && v <= input.observationDays[i - 1])
      simpleError(
        "observationDays",
        "Strictly increasing follow-up days required.",
      );
  });
  const firstZeroIndex = input.gametocyteCounts.indexOf(0),
    positiveIndexes = input.gametocyteCounts.flatMap((v, i) =>
      v > 0 ? [i] : [],
    );
  return {
    firstZeroDay:
      firstZeroIndex < 0 ? -1 : input.observationDays[firstZeroIndex],
    lastPositiveDay: positiveIndexes.length
      ? input.observationDays[positiveIndexes[positiveIndexes.length - 1]]
      : -1,
    noLaterRebound:
      firstZeroIndex >= 0 &&
      input.gametocyteCounts.slice(firstZeroIndex + 1).every((v) => v === 0),
  };
};
export const exampleInput = {
  observationDays: [0, 3, 7, 14],
  gametocyteCounts: [10, 2, 0, 0],
} satisfies Input;
export const exampleOutput = {
  firstZeroDay: 7,
  lastPositiveDay: 3,
  noLaterRebound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/gametocyte-clearance-followup",
  title: "Gametocyte Clearance Followup",
  description:
    "Track first observed zero gametocyte count and subsequent rebound in an ordered follow-up series.",
  inputs: [
    { id: "observationDays", label: "Observation days", kind: "numberList" },
    { id: "gametocyteCounts", label: "Gametocyte counts", kind: "numberList" },
  ],
  outputs: [
    { id: "firstZeroDay", label: "First zero day", kind: "number" },
    { id: "lastPositiveDay", label: "Last positive day", kind: "number" },
    { id: "noLaterRebound", label: "No later rebound", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observationDays: value.observationDays as readonly number[],
      gametocyteCounts: value.gametocyteCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
