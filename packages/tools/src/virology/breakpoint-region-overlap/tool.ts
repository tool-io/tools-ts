import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly breakpointPositionsBp: readonly number[];
  readonly regionNames: readonly string[];
  readonly regionStartsBp: readonly number[];
  readonly regionEndsBp: readonly number[];
}>;
export type Output = Readonly<{
  readonly assignments: readonly string[];
  readonly unassignedCount: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.regionNames, input.regionStartsBp, "regionNames");
  aligned(input.regionNames, input.regionEndsBp, "regionNames");
  input.breakpointPositionsBp.forEach((v) => count(v, "breakpointPositionsBp"));
  if (
    input.regionStartsBp.length *
      Math.max(1, input.breakpointPositionsBp.length) >
      1000000 ||
    input.regionStartsBp.some(
      (v, i) =>
        !Number.isSafeInteger(v) ||
        v < 0 ||
        !Number.isSafeInteger(input.regionEndsBp[i]) ||
        input.regionEndsBp[i] <= v,
    )
  )
    simpleError(
      "regionStartsBp",
      "Valid half-open annotation intervals within the comparison budget required.",
    );
  const assignments = input.breakpointPositionsBp.map((position) =>
    input.regionNames
      .filter(
        (_, i) =>
          position >= input.regionStartsBp[i] &&
          position < input.regionEndsBp[i],
      )
      .join(";"),
  );
  return { assignments, unassignedCount: assignments.filter((v) => !v).length };
};
export const exampleInput = {
  breakpointPositionsBp: [10, 20, 30],
  regionNames: ["A", "B"],
  regionStartsBp: [0, 20],
  regionEndsBp: [20, 40],
} satisfies Input;
export const exampleOutput = {
  assignments: ["A", "B", "B"],
  unassignedCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/breakpoint-region-overlap",
  title: "Breakpoint Region Overlap",
  description:
    "Map breakpoint positions to all overlapping supplied half-open regions; multiple annotations are retained rather than choosing one.",
  inputs: [
    {
      id: "breakpointPositionsBp",
      label: "Breakpoint positions bp",
      kind: "numberList",
    },
    { id: "regionNames", label: "Region names", kind: "stringList" },
    {
      id: "regionStartsBp",
      label: "Region starts bp",
      kind: "numberList",
      description:
        "Zero-based half-open coordinate convention; end positions are exclusive.",
    },
    { id: "regionEndsBp", label: "Region ends bp", kind: "numberList" },
  ],
  outputs: [
    { id: "assignments", label: "Assignments", kind: "stringList" },
    { id: "unassignedCount", label: "Unassigned count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      breakpointPositionsBp: value.breakpointPositionsBp as readonly number[],
      regionNames: value.regionNames as readonly string[],
      regionStartsBp: value.regionStartsBp as readonly number[],
      regionEndsBp: value.regionEndsBp as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
