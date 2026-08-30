import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly inputPolarizationDegrees: number;
  readonly plateAxisDegrees: number;
}>;
export type Output = Readonly<{
  readonly outputPolarizationDegrees: number;
  readonly rotationDegrees: number;
}>;

export const calculate = (input: Input): Output => {
  const raw = 2 * input.plateAxisDegrees - input.inputPolarizationDegrees;
  const outputPolarizationDegrees = ((raw % 180) + 180) % 180;
  let rotationDegrees =
    outputPolarizationDegrees -
    (((input.inputPolarizationDegrees % 180) + 180) % 180);
  if (rotationDegrees > 90) rotationDegrees -= 180;
  if (rotationDegrees <= -90) rotationDegrees += 180;
  return { outputPolarizationDegrees, rotationDegrees };
};

export const exampleInput = {
  inputPolarizationDegrees: 10,
  plateAxisDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  outputPolarizationDegrees: 50,
  rotationDegrees: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      inputPolarizationDegrees: input.inputPolarizationDegrees as number,
      plateAxisDegrees: input.plateAxisDegrees as number,
    }),
  description:
    "Calculate ideal linear-polarization rotation through a half-wave plate.",
  id: "laser/half-wave-plate-polarization",
  inputs: [
    {
      id: "inputPolarizationDegrees",
      label: "Input polarization angle",
      kind: "number",
      unit: "°",
    },
    {
      id: "plateAxisDegrees",
      label: "Half-wave plate axis angle",
      kind: "number",
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "outputPolarizationDegrees",
      label: "Output polarization angle",
      kind: "number",
      unit: "°",
    },
    {
      id: "rotationDegrees",
      label: "Net polarization rotation",
      kind: "number",
      unit: "°",
    },
  ],
  title: "Half-Wave Plate Polarization",
});

export const run = tool.execute;
export default tool;
