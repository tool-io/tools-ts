import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";
export type Input = Readonly<{
  readonly readoutMatrixSize: number;
  readonly acquiredSpokes: number;
}>;
export type Output = Readonly<{
  readonly nyquistSpokes: number;
  readonly samplingFraction: number;
  readonly angularCriterionMet: boolean;
}>;
const inputFields = [
  { id: "readoutMatrixSize", label: "Readout matrix size", kind: "integer" },
  { id: "acquiredSpokes", label: "Acquired spokes", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.readoutMatrixSize, "readoutMatrixSize", 1);
  count(input.acquiredSpokes, "acquiredSpokes", 1);
  const nyquistSpokes = Math.ceil((Math.PI * input.readoutMatrixSize) / 2);
  count(nyquistSpokes, "readoutMatrixSize", 1);
  return {
    nyquistSpokes,
    samplingFraction: input.acquiredSpokes / nyquistSpokes,
    angularCriterionMet: input.acquiredSpokes >= nyquistSpokes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  readoutMatrixSize: 128,
  acquiredSpokes: 100,
} satisfies Input;
export const exampleOutput = {
  nyquistSpokes: 202,
  samplingFraction: 0.49504950495049505,
  angularCriterionMet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/radial-angular-nyquist-sampling",
  title: "K-Space Sampling Density",
  description:
    "Screen uniformly distributed full radial spokes using ceil(πN/2) angular Nyquist coverage; golden-angle subsets and compressed-sensing reconstruction quality are not evaluated.",
  inputs: inputFields,
  outputs: [
    { id: "nyquistSpokes", label: "Nyquist spokes", kind: "number" },
    { id: "samplingFraction", label: "Sampling fraction", kind: "number" },
    {
      id: "angularCriterionMet",
      label: "Angular criterion met",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      readoutMatrixSize: value.readoutMatrixSize as number,
      acquiredSpokes: value.acquiredSpokes as number,
    }),
});
export const run = tool.execute;
export default tool;
