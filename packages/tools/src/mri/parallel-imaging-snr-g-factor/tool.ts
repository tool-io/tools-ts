import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly unacceleratedSnr: number;
  readonly acceleratedSnr: number;
  readonly nominalAcceleration: number;
}>;
export type Output = Readonly<{
  readonly gFactor: number;
  readonly noisePenalty: number;
}>;
const inputFields = [
  { id: "unacceleratedSnr", label: "Unaccelerated snr", kind: "number" },
  { id: "acceleratedSnr", label: "Accelerated snr", kind: "number" },
  { id: "nominalAcceleration", label: "Nominal acceleration", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.unacceleratedSnr, "unacceleratedSnr");
  positive(input.acceleratedSnr, "acceleratedSnr");
  if (input.nominalAcceleration < 1)
    simpleError("nominalAcceleration", "Acceleration must be at least one.");
  const noisePenalty = input.unacceleratedSnr / input.acceleratedSnr;
  return {
    gFactor: noisePenalty / Math.sqrt(input.nominalAcceleration),
    noisePenalty,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unacceleratedSnr: 100,
  acceleratedSnr: 40,
  nominalAcceleration: 4,
} satisfies Input;
export const exampleOutput = {
  gFactor: 1.25,
  noisePenalty: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/parallel-imaging-snr-g-factor",
  title: "Parallel Imaging G-Factor",
  description:
    "Infer empirical g from SNR_full/(SNR_accel·√R) using comparable scans; g below one is retained as evidence of measurement/model mismatch, not clamped.",
  inputs: inputFields,
  outputs: [
    { id: "gFactor", label: "G factor", kind: "number" },
    { id: "noisePenalty", label: "Noise penalty", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      unacceleratedSnr: value.unacceleratedSnr as number,
      acceleratedSnr: value.acceleratedSnr as number,
      nominalAcceleration: value.nominalAcceleration as number,
    }),
});
export const run = tool.execute;
export default tool;
