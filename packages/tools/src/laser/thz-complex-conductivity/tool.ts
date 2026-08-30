import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly frequencyHertz: number;
  readonly relativePermittivityReal: number;
  readonly relativePermittivityImaginary: number;
}>;
export type Output = Readonly<{
  readonly conductivityRealSiemensPerMeter: number;
  readonly conductivityImaginarySiemensPerMeter: number;
}>;

export const calculate = (input: Input): Output => {
  const factor = 2 * Math.PI * input.frequencyHertz * 8.8541878128e-12;
  return {
    conductivityRealSiemensPerMeter:
      factor * input.relativePermittivityImaginary,
    conductivityImaginarySiemensPerMeter:
      factor * (1 - input.relativePermittivityReal),
  };
};

export const exampleInput = {
  frequencyHertz: 1000000000000,
  relativePermittivityReal: 4,
  relativePermittivityImaginary: 0.1,
} satisfies Input;
export const exampleOutput = {
  conductivityRealSiemensPerMeter: 5.5632502772393515,
  conductivityImaginarySiemensPerMeter: -166.89750831718055,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      frequencyHertz: input.frequencyHertz as number,
      relativePermittivityReal: input.relativePermittivityReal as number,
      relativePermittivityImaginary:
        input.relativePermittivityImaginary as number,
    }),
  description:
    "Convert complex relative permittivity to complex conductivity under an exp(-iωt) convention.",
  id: "laser/thz-complex-conductivity",
  inputs: [
    {
      id: "frequencyHertz",
      label: "Frequency",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "relativePermittivityReal",
      label: "Relative permittivity real part",
      kind: "number",
    },
    {
      id: "relativePermittivityImaginary",
      label: "Relative permittivity imaginary part",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "conductivityRealSiemensPerMeter",
      label: "Conductivity real part",
      kind: "number",
      unit: "S/m",
    },
    {
      id: "conductivityImaginarySiemensPerMeter",
      label: "Conductivity imaginary part",
      kind: "number",
      unit: "S/m",
    },
  ],
  title: "THz Complex Conductivity",
});

export const run = tool.execute;
export default tool;
