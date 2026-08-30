import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bValue } from "../shared.js";
export type Input = Readonly<{
  readonly gammaHzPerTesla: number;
  readonly gradientMilliTeslaPerMeter: number;
  readonly deltaMs: number;
  readonly separationMs: number;
}>;
export type Output = Readonly<{
  readonly bSecondsPerSquareMm: number;
}>;
const inputFields = [
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
  {
    id: "gradientMilliTeslaPerMeter",
    label: "Gradient milli tesla per meter",
    kind: "number",
  },
  { id: "deltaMs", label: "Delta ms", kind: "number", unit: "ms" },
  { id: "separationMs", label: "Separation ms", kind: "number", unit: "ms" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    bSecondsPerSquareMm: bValue(
      input.gammaHzPerTesla,
      input.gradientMilliTeslaPerMeter,
      input.deltaMs,
      input.separationMs,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  gammaHzPerTesla: 1000000,
  gradientMilliTeslaPerMeter: 10,
  deltaMs: 10,
  separationMs: 30,
} satisfies Input;
export const exampleOutput = {
  bSecondsPerSquareMm: 0.01052757802782865,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/rectangular-pgse-diffusion-b-value",
  title: "Diffusion B-Value",
  description:
    "Compute the Stejskal–Tanner b value for ideal rectangular PGSE pulses in s/mm² with γ supplied in Hz/T; waveform cross-terms and imaging gradients are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "bSecondsPerSquareMm",
      label: "B seconds per square mm",
      kind: "number",
      unit: "mm",
    },
  ],
  calculate: (value) =>
    calculate({
      gammaHzPerTesla: value.gammaHzPerTesla as number,
      gradientMilliTeslaPerMeter: value.gradientMilliTeslaPerMeter as number,
      deltaMs: value.deltaMs as number,
      separationMs: value.separationMs as number,
    }),
});
export const run = tool.execute;
export default tool;
