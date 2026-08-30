import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly chemicalShiftPpm: number;
  readonly referenceFrequencyMHz: number;
  readonly readoutHzPerPixel: number;
  readonly pixelSizeMm: number;
}>;
export type Output = Readonly<{
  readonly signedShiftPixels: number;
  readonly signedDisplacementMm: number;
}>;
const inputFields = [
  {
    id: "chemicalShiftPpm",
    label: "Chemical shift ppm",
    kind: "number",
    unit: "ppm",
  },
  {
    id: "referenceFrequencyMHz",
    label: "Reference frequency m hz",
    kind: "number",
    unit: "Hz",
  },
  { id: "readoutHzPerPixel", label: "Readout hz per pixel", kind: "number" },
  { id: "pixelSizeMm", label: "Pixel size mm", kind: "number", unit: "mm" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceFrequencyMHz, "referenceFrequencyMHz");
  positive(input.readoutHzPerPixel, "readoutHzPerPixel");
  positive(input.pixelSizeMm, "pixelSizeMm");
  const signedShiftPixels =
    (input.chemicalShiftPpm * input.referenceFrequencyMHz) /
    input.readoutHzPerPixel;
  return {
    signedShiftPixels,
    signedDisplacementMm: signedShiftPixels * input.pixelSizeMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  chemicalShiftPpm: -3.5,
  referenceFrequencyMHz: 100,
  readoutHzPerPixel: 200,
  pixelSizeMm: 1,
} satisfies Input;
export const exampleOutput = {
  signedShiftPixels: -1.75,
  signedDisplacementMm: -1.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/readout-chemical-shift-displacement",
  title: "Chemical Shift Artifact Pixels",
  description:
    "Estimate signed frequency-encoding chemical-shift displacement using supplied shift, reference frequency and pixel bandwidth; direction depends on readout polarity.",
  inputs: inputFields,
  outputs: [
    { id: "signedShiftPixels", label: "Signed shift pixels", kind: "number" },
    {
      id: "signedDisplacementMm",
      label: "Signed displacement mm",
      kind: "number",
      unit: "mm",
    },
  ],
  calculate: (value) =>
    calculate({
      chemicalShiftPpm: value.chemicalShiftPpm as number,
      referenceFrequencyMHz: value.referenceFrequencyMHz as number,
      readoutHzPerPixel: value.readoutHzPerPixel as number,
      pixelSizeMm: value.pixelSizeMm as number,
    }),
});
export const run = tool.execute;
export default tool;
