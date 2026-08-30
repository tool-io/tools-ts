import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ManningVelocityInput = Readonly<{
  readonly manningN: number;
  readonly hydraulicRadiusMeters: number;
  readonly slope: number;
}>;
export type ManningVelocityOutput = Readonly<{
  readonly velocityMetersPerSecond: number;
}>;

export const calculateManningVelocity = (
  x: ManningVelocityInput,
): ManningVelocityOutput => {
  if (!Number.isFinite(x.manningN) || x.manningN < 0)
    simpleError("manningN", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hydraulicRadiusMeters) || x.hydraulicRadiusMeters < 0)
    simpleError("hydraulicRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.slope) || x.slope < 0)
    simpleError("slope", "Provide a finite number at least 0.");
  const velocityMetersPerSecond =
    (x.hydraulicRadiusMeters ** (2 / 3) * Math.sqrt(x.slope)) / x.manningN;
  if (!Number.isFinite(velocityMetersPerSecond))
    simpleError(
      "velocityMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    velocityMetersPerSecond: Object.is(velocityMetersPerSecond, -0)
      ? 0
      : velocityMetersPerSecond,
  };
};

export const example = {
  input: { manningN: 0.03, hydraulicRadiusMeters: 1, slope: 0.001 },
  output: { velocityMetersPerSecond: 1.0540925533894598 },
} satisfies ToolExample<ManningVelocityInput, ManningVelocityOutput>;

export const tool = createSimpleTool({
  id: "engineering/manning-velocity",
  title: "Manning Velocity",
  description:
    "Open-channel mean velocity from Manning n, hydraulic radius and energy slope in SI units.",
  inputs: [
    { id: "manningN", kind: "number", label: "Manning N", minimum: 0 },
    {
      id: "hydraulicRadiusMeters",
      kind: "number",
      label: "Hydraulic Radius Meters",
      unit: "m",
      minimum: 0,
    },
    { id: "slope", kind: "number", label: "Slope", minimum: 0 },
  ],
  outputs: [
    {
      id: "velocityMetersPerSecond",
      kind: "number",
      label: "Velocity Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateManningVelocity({
      manningN: input.manningN as number,
      hydraulicRadiusMeters: input.hydraulicRadiusMeters as number,
      slope: input.slope as number,
    }),
});
export const manningVelocityTool = tool;
export const runManningVelocity = tool.execute;
export default tool;
