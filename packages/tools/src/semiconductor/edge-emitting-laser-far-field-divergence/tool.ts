import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdgeEmittingLaserFarFieldDivergenceInput = Readonly<{
  readonly wavelengthMeters: number;
  readonly waistRadiusMeters: number;
}>;
export type EdgeEmittingLaserFarFieldDivergenceOutput = Readonly<{
  readonly halfAngleRadians: number;
}>;

export const calculateEdgeEmittingLaserFarFieldDivergence = (
  x: EdgeEmittingLaserFarFieldDivergenceInput,
): EdgeEmittingLaserFarFieldDivergenceOutput => {
  if (!Number.isFinite(x.wavelengthMeters) || x.wavelengthMeters < 0)
    simpleError("wavelengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.waistRadiusMeters) || x.waistRadiusMeters < 0)
    simpleError("waistRadiusMeters", "Provide a finite number at least 0.");
  const halfAngleRadians = x.wavelengthMeters / (Math.PI * x.waistRadiusMeters);
  if (!Number.isFinite(halfAngleRadians))
    simpleError(
      "halfAngleRadians",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    halfAngleRadians: Object.is(halfAngleRadians, -0) ? 0 : halfAngleRadians,
  };
};

export const example = {
  input: { wavelengthMeters: 0.000001, waistRadiusMeters: 0.000002 },
  output: { halfAngleRadians: 0.15915494309189535 },
} satisfies ToolExample<
  EdgeEmittingLaserFarFieldDivergenceInput,
  EdgeEmittingLaserFarFieldDivergenceOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/edge-emitting-laser-far-field-divergence",
  title: "Edge Emitting Laser Far Field Divergence",
  description:
    "Diffraction-limited far-field half-angle of an edge-emitting laser assuming a Gaussian mode with measured 1/e² waist radius.",
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
    calculateEdgeEmittingLaserFarFieldDivergence({
      wavelengthMeters: input.wavelengthMeters as number,
      waistRadiusMeters: input.waistRadiusMeters as number,
    }),
});
export const edgeEmittingLaserFarFieldDivergenceTool = tool;
export const runEdgeEmittingLaserFarFieldDivergence = tool.execute;
export default tool;
