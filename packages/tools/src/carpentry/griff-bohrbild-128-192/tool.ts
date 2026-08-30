import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GriffBohrbild128192Input = Readonly<{
  readonly centerMillimeters: number;
  readonly holeSpacingMillimeters: number;
}>;
export type GriffBohrbild128192Output = Readonly<{
  readonly leftCenterMillimeters: number;
  readonly rightCenterMillimeters: number;
}>;

export const calculateGriffBohrbild128192 = (
  x: GriffBohrbild128192Input,
): GriffBohrbild128192Output => {
  if (!Number.isFinite(x.centerMillimeters) || x.centerMillimeters < 0)
    simpleError("centerMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.holeSpacingMillimeters) ||
    x.holeSpacingMillimeters < 0
  )
    simpleError(
      "holeSpacingMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.holeSpacingMillimeters !== 128 && x.holeSpacingMillimeters !== 192)
    simpleError("input", "Inputs violate the stated model or operating range.");
  if (x.centerMillimeters < x.holeSpacingMillimeters / 2)
    simpleError(
      "centerMillimeters",
      "The left hole center would fall before the zero datum.",
    );
  const leftCenterMillimeters =
    x.centerMillimeters - x.holeSpacingMillimeters / 2;
  if (!Number.isFinite(leftCenterMillimeters))
    simpleError(
      "leftCenterMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  const rightCenterMillimeters =
    x.centerMillimeters + x.holeSpacingMillimeters / 2;
  if (!Number.isFinite(rightCenterMillimeters))
    simpleError(
      "rightCenterMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    leftCenterMillimeters: Object.is(leftCenterMillimeters, -0)
      ? 0
      : leftCenterMillimeters,
    rightCenterMillimeters: Object.is(rightCenterMillimeters, -0)
      ? 0
      : rightCenterMillimeters,
  };
};

export const example = {
  input: { centerMillimeters: 300, holeSpacingMillimeters: 128 },
  output: { leftCenterMillimeters: 236, rightCenterMillimeters: 364 },
} satisfies ToolExample<GriffBohrbild128192Input, GriffBohrbild128192Output>;

export const tool = createSimpleTool({
  id: "carpentry/griff-bohrbild-128-192",
  title: "Griff Bohrbild 128 192",
  description:
    "Two cabinet-handle bore center positions about a marked centerline for standard 128 mm or 192 mm center spacing.",
  inputs: [
    {
      id: "centerMillimeters",
      kind: "number",
      label: "Center Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "holeSpacingMillimeters",
      kind: "number",
      label: "Hole Spacing Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "leftCenterMillimeters",
      kind: "number",
      label: "Left Center Millimeters",
      unit: "mm",
    },
    {
      id: "rightCenterMillimeters",
      kind: "number",
      label: "Right Center Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateGriffBohrbild128192({
      centerMillimeters: input.centerMillimeters as number,
      holeSpacingMillimeters: input.holeSpacingMillimeters as number,
    }),
});
export const griffBohrbild128192Tool = tool;
export const runGriffBohrbild128192 = tool.execute;
export default tool;
