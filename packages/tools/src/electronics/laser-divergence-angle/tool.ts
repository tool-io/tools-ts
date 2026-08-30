import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaserDivergenceAngleInput = Readonly<{
  readonly wavelengthMeters: number;
  readonly waistRadiusMeters: number;
}>;
export type LaserDivergenceAngleOutput = Readonly<{
  readonly halfAngleRadians: number;
}>;

export const calculateLaserDivergenceAngle = (
  x: LaserDivergenceAngleInput,
): LaserDivergenceAngleOutput => {
  if (!Number.isFinite(x.wavelengthMeters) || x.wavelengthMeters < 0)
    simpleError("wavelengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.waistRadiusMeters) || x.waistRadiusMeters < 0)
    simpleError("waistRadiusMeters", "Provide a finite number at least 0.");
  const halfAngleRadians = x.wavelengthMeters / (Math.PI * x.waistRadiusMeters);
  if (!Number.isFinite(halfAngleRadians))
    simpleError(
      "halfAngleRadians",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    halfAngleRadians: Object.is(halfAngleRadians, -0) ? 0 : halfAngleRadians,
  };
};

export const example = {
  input: { wavelengthMeters: 0.000001, waistRadiusMeters: 0.001 },
  output: { halfAngleRadians: 0.00031830988618379065 },
} satisfies ToolExample<LaserDivergenceAngleInput, LaserDivergenceAngleOutput>;

export const tool = createSimpleTool({
  id: "electronics/laser-divergence-angle",
  title: "Laser Divergence Angle",
  description:
    "Far-field half-angle divergence of an ideal diffraction-limited Gaussian beam from wavelength and waist radius.",
  inputs: [
    {
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "waistRadiusMeters",
      kind: "number",
      label: "Waist Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "halfAngleRadians",
      kind: "number",
      label: "Half Angle Radians",
      unit: "rad",
    },
  ],
  calculate: (input) =>
    calculateLaserDivergenceAngle({
      wavelengthMeters: input.wavelengthMeters as number,
      waistRadiusMeters: input.waistRadiusMeters as number,
    }),
});
export const laserDivergenceAngleTool = tool;
export const runLaserDivergenceAngle = tool.execute;
export default tool;
