import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScaleBarSegmentLengthInput = Readonly<{
  readonly groundKilometers: number;
  readonly denominator: number;
}>;
export type ScaleBarSegmentLengthOutput = Readonly<{
  readonly mapCentimeters: number;
}>;

export const calculateScaleBarSegmentLength = (
  x: ScaleBarSegmentLengthInput,
): ScaleBarSegmentLengthOutput => {
  if (!Number.isFinite(x.groundKilometers) || x.groundKilometers < 0)
    simpleError("groundKilometers", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const mapCentimeters = (x.groundKilometers * 100000) / x.denominator;
  if (!Number.isFinite(mapCentimeters))
    simpleError(
      "mapCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { mapCentimeters: Object.is(mapCentimeters, -0) ? 0 : mapCentimeters };
};

export const example = {
  input: {
    groundKilometers: 5,
    denominator: 100000,
  },
  output: { mapCentimeters: 5 },
} satisfies ToolExample<
  ScaleBarSegmentLengthInput,
  ScaleBarSegmentLengthOutput
>;

export const tool = createSimpleTool({
  id: "cartography/scale-bar-segment-length",
  title: "Scale Bar Segment Length",
  description:
    "Length of a scale-bar segment on the map in centimetres for a given ground distance and 1:N scale.",
  inputs: [
    {
      id: "groundKilometers",
      kind: "number",
      label: "Ground Kilometers",
      unit: "km",
      minimum: 0,
    },
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "mapCentimeters",
      kind: "number",
      label: "Map Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateScaleBarSegmentLength({
      groundKilometers: input.groundKilometers as number,
      denominator: input.denominator as number,
    }),
});
export const scaleBarSegmentLengthTool = tool;
export const runScaleBarSegmentLength = tool.execute;
export default tool;
