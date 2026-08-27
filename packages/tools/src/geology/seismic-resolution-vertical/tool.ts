import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicResolutionVerticalInput = {
  readonly velocityMPers: number;
  readonly frequencyHz: number;
};

export type SeismicResolutionVerticalOutput = {
  readonly wavelengthM: number;
  readonly verticalResolutionM: number;
};

export const calculateSeismicResolutionVertical = (
  input: SeismicResolutionVerticalInput,
): SeismicResolutionVerticalOutput => {
  if (!(input.velocityMPers > 0))
    return simpleError(
      "velocityMPers",
      "Velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.frequencyHz > 0))
    return simpleError(
      "frequencyHz",
      "Frequency must be greater than zero.",
      "invalid_frequency",
    );
  const wavelengthM = input.velocityMPers / input.frequencyHz;
  return { wavelengthM, verticalResolutionM: wavelengthM / 4 };
};

export const seismicResolutionVerticalExample = {
  input: { velocityMPers: 3000, frequencyHz: 30 },
  output: { wavelengthM: 100, verticalResolutionM: 25 },
} satisfies ToolExample<
  SeismicResolutionVerticalInput,
  SeismicResolutionVerticalOutput
>;

export const seismicResolutionVerticalTool = createSimpleTool({
  id: "geology/seismic-resolution-vertical",
  title: "Seismic Resolution Vertical Calculator",
  description:
    "Vertical (Rayleigh/Widess) resolution as one quarter of the dominant wavelength lambda = V / f, with velocity in meters per second and dominant frequency in hertz; two features closer than this cannot be separated in time.",
  inputs: [
    {
      description: "P-wave interval velocity in meters per second.",
      id: "velocityMPers",
      kind: "number",
      label: "V",
      minimum: 0,
    },
    {
      description: "Dominant frequency in hertz.",
      id: "frequencyHz",
      kind: "number",
      label: "f",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dominant wavelength in meters.",
      id: "wavelengthM",
      kind: "number",
      label: "lambda",
    },
    {
      description: "Quarter-wavelength vertical resolution limit in meters.",
      id: "verticalResolutionM",
      kind: "number",
      label: "lambda/4",
    },
  ],
  calculate: (input) =>
    calculateSeismicResolutionVertical(
      input as unknown as SeismicResolutionVerticalInput,
    ),
});

export const runSeismicResolutionVertical =
  seismicResolutionVerticalTool.execute;
export default seismicResolutionVerticalTool;
