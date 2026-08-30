import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly averagePowerWatts: number;
  readonly initialBeamRadiusMeters: number;
  readonly halfAngleDivergenceRadians: number;
  readonly maximumIrradianceWPerM2: number;
}>;
export type Output = Readonly<{
  readonly requiredBeamRadiusMeters: number;
  readonly minimumDistanceMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.halfAngleDivergenceRadians <= 0 ||
    input.maximumIrradianceWPerM2 <= 0
  )
    simpleError(
      "halfAngleDivergenceRadians",
      "Divergence and irradiance limit must be positive.",
      "invalid_limits",
    );
  const requiredBeamRadiusMeters = Math.sqrt(
    input.averagePowerWatts / (Math.PI * input.maximumIrradianceWPerM2),
  );
  return {
    requiredBeamRadiusMeters,
    minimumDistanceMeters: Math.max(
      0,
      (requiredBeamRadiusMeters - input.initialBeamRadiusMeters) /
        Math.tan(input.halfAngleDivergenceRadians),
    ),
  };
};

export const exampleInput = {
  averagePowerWatts: 3.141592653589793,
  initialBeamRadiusMeters: 0,
  halfAngleDivergenceRadians: 0.7853981633974483,
  maximumIrradianceWPerM2: 1,
} satisfies Input;
export const exampleOutput = {
  requiredBeamRadiusMeters: 1,
  minimumDistanceMeters: 1.0000000000000002,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      averagePowerWatts: input.averagePowerWatts as number,
      initialBeamRadiusMeters: input.initialBeamRadiusMeters as number,
      halfAngleDivergenceRadians: input.halfAngleDivergenceRadians as number,
      maximumIrradianceWPerM2: input.maximumIrradianceWPerM2 as number,
    }),
  description:
    "Estimate projector distance needed to meet a caller-supplied irradiance limit.",
  id: "laser/audience-safe-distance",
  inputs: [
    {
      id: "averagePowerWatts",
      label: "Average projector power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "initialBeamRadiusMeters",
      label: "Initial beam radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "halfAngleDivergenceRadians",
      label: "Beam half-angle divergence",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "maximumIrradianceWPerM2",
      label: "Caller maximum irradiance",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
  ],
  outputs: [
    {
      id: "requiredBeamRadiusMeters",
      label: "Required beam radius",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "minimumDistanceMeters",
      label: "Minimum distance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Audience Safe Distance",
});

export const run = tool.execute;
export default tool;
