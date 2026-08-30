import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly wavelengthNanometers: number;
  readonly objectiveFNumber: number;
  readonly relayMagnification: number;
}>;
export type Output = Readonly<{
  readonly airyDiameterMicrometers: number;
  readonly pinholeDiameterMicrometers: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.objectiveFNumber <= 0)
    simpleError(
      "objectiveFNumber",
      "F-number must be positive.",
      "invalid_f_number",
    );
  const airyDiameterMicrometers =
    ((2.44 * input.wavelengthNanometers) / 1000) * input.objectiveFNumber;
  return {
    airyDiameterMicrometers,
    pinholeDiameterMicrometers:
      airyDiameterMicrometers * input.relayMagnification,
  };
};

export const exampleInput = {
  wavelengthNanometers: 500,
  objectiveFNumber: 4,
  relayMagnification: 10,
} satisfies Input;
export const exampleOutput = {
  airyDiameterMicrometers: 4.88,
  pinholeDiameterMicrometers: 48.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      wavelengthNanometers: input.wavelengthNanometers as number,
      objectiveFNumber: input.objectiveFNumber as number,
      relayMagnification: input.relayMagnification as number,
    }),
  description:
    "Calculate an Airy-diameter spatial-filter pinhole size with relay magnification.",
  id: "laser/spatial-filter-pinhole",
  inputs: [
    {
      id: "wavelengthNanometers",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
    {
      id: "objectiveFNumber",
      label: "Objective f-number",
      kind: "number",
      minimum: 0,
    },
    {
      id: "relayMagnification",
      label: "Relay magnification",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "airyDiameterMicrometers",
      label: "Airy diameter at focus",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "pinholeDiameterMicrometers",
      label: "Magnified Airy pinhole diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "Spatial-Filter Pinhole",
});

export const run = tool.execute;
export default tool;
