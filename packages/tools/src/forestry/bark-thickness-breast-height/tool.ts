import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarkThicknessBreastHeightInput = Readonly<{
  readonly overBarkDbhCentimeters: number;
  readonly underBarkDbhCentimeters: number;
}>;
export type BarkThicknessBreastHeightOutput = Readonly<{
  readonly barkThicknessCentimeters: number;
}>;

export const calculateBarkThicknessBreastHeight = (
  x: BarkThicknessBreastHeightInput,
): BarkThicknessBreastHeightOutput => {
  if (
    !Number.isFinite(x.overBarkDbhCentimeters) ||
    x.overBarkDbhCentimeters <= 0
  )
    simpleError("overBarkDbhCentimeters", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.underBarkDbhCentimeters) ||
    x.underBarkDbhCentimeters < 0
  )
    simpleError(
      "underBarkDbhCentimeters",
      "Provide a finite nonnegative number.",
    );
  if (!(x.underBarkDbhCentimeters <= x.overBarkDbhCentimeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const barkThicknessCentimeters =
    (x.overBarkDbhCentimeters - x.underBarkDbhCentimeters) / 2;
  if (!Number.isFinite(barkThicknessCentimeters))
    simpleError(
      "barkThicknessCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    barkThicknessCentimeters: Object.is(barkThicknessCentimeters, -0)
      ? 0
      : barkThicknessCentimeters,
  };
};

export const example = {
  input: {
    overBarkDbhCentimeters: 20,
    underBarkDbhCentimeters: 18,
  },
  output: { barkThicknessCentimeters: 1 },
} satisfies ToolExample<
  BarkThicknessBreastHeightInput,
  BarkThicknessBreastHeightOutput
>;

export const tool = createSimpleTool({
  id: "forestry/bark-thickness-breast-height",
  title: "Bark Thickness Breast Height",
  description:
    "Average radial bark thickness at breast height from over-bark and under-bark diameters.",
  inputs: [
    {
      id: "overBarkDbhCentimeters",
      kind: "number",
      label: "Over Bark Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "underBarkDbhCentimeters",
      kind: "number",
      label: "Under Bark Dbh Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "barkThicknessCentimeters",
      kind: "number",
      label: "Bark Thickness Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateBarkThicknessBreastHeight({
      overBarkDbhCentimeters: input.overBarkDbhCentimeters as number,
      underBarkDbhCentimeters: input.underBarkDbhCentimeters as number,
    }),
});
export const barkThicknessBreastHeightTool = tool;
export const runBarkThicknessBreastHeight = tool.execute;
export default tool;
