import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TidalCurveInterpolationInput = {
  readonly lowWaterMeters: number;
  readonly highWaterMeters: number;
  readonly hoursIntoInterval: number;
  readonly intervalHours: number;
};

export type TidalCurveInterpolationOutput = {
  readonly heightMeters: number;
};

export const tidalCurveInterpolationExample = {
  input: {
    highWaterMeters: 4,
    hoursIntoInterval: 3,
    intervalHours: 6,
    lowWaterMeters: 1,
  },
  output: { heightMeters: 2.5 },
} satisfies ToolExample<
  TidalCurveInterpolationInput,
  TidalCurveInterpolationOutput
>;

export const calculateTidalCurveInterpolation = (
  input: TidalCurveInterpolationInput,
): TidalCurveInterpolationOutput => {
  if (!(input.highWaterMeters >= input.lowWaterMeters))
    simpleError(
      "highWaterMeters",
      "High water must not be below low water.",
      "invalid_levels",
    );
  if (!(input.intervalHours > 0))
    simpleError(
      "intervalHours",
      "The interval between successive tides must be positive.",
      "invalid_interval",
    );
  if (
    input.hoursIntoInterval < 0 ||
    input.hoursIntoInterval > input.intervalHours
  )
    simpleError(
      "hoursIntoInterval",
      "Hours into the interval must lie between zero and the interval length.",
      "invalid_hours",
    );
  return {
    heightMeters:
      input.lowWaterMeters +
      ((input.highWaterMeters - input.lowWaterMeters) *
        (Math.cos((Math.PI * input.hoursIntoInterval) / input.intervalHours) +
          1)) /
        2,
  };
};

export const tidalCurveInterpolationTool = createSimpleTool({
  id: "sailing/tidal-curve-interpolation",
  title: "Tidal Curve Height",
  description:
    "Interpolate a falling tide from high water to low water with a cosine curve over the specified high-to-low interval.",
  inputs: [
    {
      description: "Water level at low water.",
      id: "lowWaterMeters",
      kind: "number",
      label: "Low water",
      unit: "m",
    },
    {
      description: "Water level at high water.",
      id: "highWaterMeters",
      kind: "number",
      label: "High water",
      unit: "m",
    },
    {
      description: "Hours elapsed since high water.",
      id: "hoursIntoInterval",
      kind: "number",
      label: "Hours into interval",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Length of the tidal interval.",
      id: "intervalHours",
      kind: "number",
      label: "Interval",
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Interpolated tide height.",
      format: "length-m",
      id: "heightMeters",
      kind: "number",
      label: "Height",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateTidalCurveInterpolation(
      input as unknown as TidalCurveInterpolationInput,
    ),
});

export const runTidalCurveInterpolation = tidalCurveInterpolationTool.execute;
export default tidalCurveInterpolationTool;
