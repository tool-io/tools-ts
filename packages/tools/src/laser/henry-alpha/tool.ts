import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly centerWavelengthMeters: number;
  readonly wavelengthChangeMeters: number;
  readonly modalGainChangePerMeter: number;
}>;
export type Output = Readonly<{
  readonly wavelengthGainSlopeM2: number;
  readonly linewidthEnhancementFactor: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.centerWavelengthMeters <= 0 || input.modalGainChangePerMeter === 0)
    simpleError(
      "modalGainChangePerMeter",
      "Wavelength and nonzero gain change are required.",
      "invalid_measurement",
    );
  const wavelengthGainSlopeM2 =
    input.wavelengthChangeMeters / input.modalGainChangePerMeter;
  return {
    wavelengthGainSlopeM2,
    linewidthEnhancementFactor:
      ((-4 * Math.PI) / input.centerWavelengthMeters ** 2) *
      wavelengthGainSlopeM2,
  };
};

export const exampleInput = {
  centerWavelengthMeters: 2,
  wavelengthChangeMeters: -1,
  modalGainChangePerMeter: 3.141592653589793,
} satisfies Input;
export const exampleOutput = {
  wavelengthGainSlopeM2: -0.3183098861837907,
  linewidthEnhancementFactor: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      centerWavelengthMeters: input.centerWavelengthMeters as number,
      wavelengthChangeMeters: input.wavelengthChangeMeters as number,
      modalGainChangePerMeter: input.modalGainChangePerMeter as number,
    }),
  description:
    "Estimate the Henry linewidth-enhancement factor from wavelength and modal-gain changes.",
  id: "laser/henry-alpha",
  inputs: [
    {
      id: "centerWavelengthMeters",
      label: "Center wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "wavelengthChangeMeters",
      label: "Wavelength change",
      kind: "number",
      unit: "m",
    },
    {
      id: "modalGainChangePerMeter",
      label: "Modal gain change",
      kind: "number",
      unit: "1/m",
    },
  ],
  outputs: [
    {
      id: "wavelengthGainSlopeM2",
      label: "Wavelength-to-gain slope",
      kind: "number",
      unit: "m²",
    },
    {
      id: "linewidthEnhancementFactor",
      label: "Henry alpha factor",
      kind: "number",
    },
  ],
  title: "Henry Alpha",
});

export const run = tool.execute;
export default tool;
