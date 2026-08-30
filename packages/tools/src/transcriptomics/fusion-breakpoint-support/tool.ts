import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly readLeftCoordinates: readonly number[];
  readonly readRightCoordinates: readonly number[];
  readonly leftBreakpoint: number;
  readonly rightBreakpoint: number;
  readonly breakpointTolerance: number;
}>;
export type Output = Readonly<{
  readonly supportingReadIndexes: readonly number[];
  readonly supportCount: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.readLeftCoordinates.length;
  if (
    n === 0 ||
    input.readRightCoordinates.length !== n ||
    input.breakpointTolerance < 0
  )
    simpleError(
      "readLeftCoordinates",
      "Aligned read coordinates and tolerance are required.",
    );
  const supportingReadIndexes = input.readLeftCoordinates.flatMap((v, i) =>
    Math.abs(v - input.leftBreakpoint) <= input.breakpointTolerance &&
    Math.abs(input.readRightCoordinates[i] - input.rightBreakpoint) <=
      input.breakpointTolerance &&
    v < input.readRightCoordinates[i]
      ? [i]
      : [],
  );
  return { supportingReadIndexes, supportCount: supportingReadIndexes.length };
};

export const exampleInput = {
  readLeftCoordinates: [90, 50, 99],
  readRightCoordinates: [110, 95, 101],
  leftBreakpoint: 100,
  rightBreakpoint: 100,
  breakpointTolerance: 10,
} satisfies Input;
export const exampleOutput = {
  supportingReadIndexes: [0, 2],
  supportCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/fusion-breakpoint-support",
  title: "Fusion Breakpoint Support",
  description:
    "Count read pairs spanning a caller-specified fusion breakpoint.",
  inputs: [
    {
      id: "readLeftCoordinates",
      kind: "numberList",
      label: "Read left coordinates",
    },
    {
      id: "readRightCoordinates",
      kind: "numberList",
      label: "Read right coordinates",
    },
    { id: "leftBreakpoint", kind: "number", label: "Left breakpoint" },
    { id: "rightBreakpoint", kind: "number", label: "Right breakpoint" },
    {
      id: "breakpointTolerance",
      kind: "number",
      label: "Breakpoint tolerance",
    },
  ],
  outputs: [
    {
      id: "supportingReadIndexes",
      kind: "numberList",
      label: "Supporting read indexes",
    },
    { id: "supportCount", kind: "number", label: "Support count" },
  ],
  calculate: (value) =>
    calculate({
      readLeftCoordinates: value.readLeftCoordinates as readonly number[],
      readRightCoordinates: value.readRightCoordinates as readonly number[],
      leftBreakpoint: value.leftBreakpoint as number,
      rightBreakpoint: value.rightBreakpoint as number,
      breakpointTolerance: value.breakpointTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
