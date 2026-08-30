import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UltrasoundWavelengthTissueInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly frequencyMegahertz: number;
}>;
export type UltrasoundWavelengthTissueOutput = Readonly<{
  readonly wavelengthMillimeters: number;
}>;

export const calculateUltrasoundWavelengthTissue = (
  x: UltrasoundWavelengthTissueInput,
): UltrasoundWavelengthTissueOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond <= 0)
    simpleError("speedMetersPerSecond", "Provide a finite positive number.");
  if (!Number.isFinite(x.frequencyMegahertz) || x.frequencyMegahertz <= 0)
    simpleError("frequencyMegahertz", "Provide a finite positive number.");
  const wavelengthMillimeters =
    x.speedMetersPerSecond / (1000 * x.frequencyMegahertz);
  if (!Number.isFinite(wavelengthMillimeters))
    simpleError(
      "wavelengthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    wavelengthMillimeters: Object.is(wavelengthMillimeters, -0)
      ? 0
      : wavelengthMillimeters,
  };
};

export const example = {
  input: {
    speedMetersPerSecond: 1540,
    frequencyMegahertz: 1,
  },
  output: { wavelengthMillimeters: 1.54 },
} satisfies ToolExample<
  UltrasoundWavelengthTissueInput,
  UltrasoundWavelengthTissueOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/ultrasound-wavelength-tissue",
  title: "Ultrasound Wavelength Tissue",
  description:
    "Ultrasound wavelength in millimetres from tissue sound speed and transducer frequency in megahertz.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "frequencyMegahertz",
      kind: "number",
      label: "Frequency Megahertz",
      unit: "MHz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "wavelengthMillimeters",
      kind: "number",
      label: "Wavelength Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateUltrasoundWavelengthTissue({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      frequencyMegahertz: input.frequencyMegahertz as number,
    }),
});
export const ultrasoundWavelengthTissueTool = tool;
export const runUltrasoundWavelengthTissue = tool.execute;
export default tool;
