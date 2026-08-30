import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly plateIds: readonly string[];
  readonly colonyCounts: readonly number[];
  readonly minimumCount: number;
  readonly maximumCount: number;
}>;
export type Output = Readonly<{
  readonly countablePlateIds: readonly string[];
  readonly belowRangePlateIds: readonly string[];
  readonly aboveRangePlateIds: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.plateIds, input.colonyCounts, "plateIds");
  input.colonyCounts.forEach((v) => count(v, "colonyCounts"));
  count(input.minimumCount, "minimumCount");
  count(input.maximumCount, "maximumCount");
  if (
    input.maximumCount < input.minimumCount ||
    new Set(input.plateIds).size !== input.plateIds.length
  )
    simpleError(
      "maximumCount",
      "Ordered count limits and distinct plate IDs required.",
    );
  return {
    countablePlateIds: input.plateIds.filter(
      (_, i) =>
        input.colonyCounts[i] >= input.minimumCount &&
        input.colonyCounts[i] <= input.maximumCount,
    ),
    belowRangePlateIds: input.plateIds.filter(
      (_, i) => input.colonyCounts[i] < input.minimumCount,
    ),
    aboveRangePlateIds: input.plateIds.filter(
      (_, i) => input.colonyCounts[i] > input.maximumCount,
    ),
  };
};
export const exampleInput = {
  plateIds: ["A", "B", "C"],
  colonyCounts: [20, 100, 350],
  minimumCount: 30,
  maximumCount: 300,
} satisfies Input;
export const exampleOutput = {
  countablePlateIds: ["B"],
  belowRangePlateIds: ["A"],
  aboveRangePlateIds: ["C"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/countable-plate-selection",
  title: "Countable Plate Selection",
  description:
    "Select colony-count plates within caller-specified countability limits, retaining low and excessive counts separately.",
  inputs: [
    { id: "plateIds", label: "Plate ids", kind: "stringList" },
    { id: "colonyCounts", label: "Colony counts", kind: "numberList" },
    { id: "minimumCount", label: "Minimum count", kind: "integer", minimum: 0 },
    { id: "maximumCount", label: "Maximum count", kind: "integer", minimum: 0 },
  ],
  outputs: [
    {
      id: "countablePlateIds",
      label: "Countable plate ids",
      kind: "stringList",
    },
    {
      id: "belowRangePlateIds",
      label: "Below range plate ids",
      kind: "stringList",
    },
    {
      id: "aboveRangePlateIds",
      label: "Above range plate ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      plateIds: value.plateIds as readonly string[],
      colonyCounts: value.colonyCounts as readonly number[],
      minimumCount: value.minimumCount as number,
      maximumCount: value.maximumCount as number,
    }),
});
export const run = tool.execute;
export default tool;
