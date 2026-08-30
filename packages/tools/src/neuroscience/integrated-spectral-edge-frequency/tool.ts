import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, spectrumEdge } from "../shared.js";
export type Input = Readonly<{
  readonly frequenciesHz: readonly number[];
  readonly powerDensity: readonly number[];
  readonly powerFraction: number;
}>;
export type Output = Readonly<{
  readonly edgeFrequencyHz: number;
}>;
const inputFields = [
  { id: "frequenciesHz", label: "Frequencies hz", kind: "numberList" },
  { id: "powerDensity", label: "Power density", kind: "numberList" },
  { id: "powerFraction", label: "Power fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    edgeFrequencyHz: spectrumEdge(
      input.frequenciesHz,
      input.powerDensity,
      input.powerFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frequenciesHz: [0, 10, 20],
  powerDensity: [1, 1, 1],
  powerFraction: 0.75,
} satisfies Input;
export const exampleOutput = { edgeFrequencyHz: 15 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/integrated-spectral-edge-frequency",
  title: "Spectral Edge Frequency",
  description:
    "Locate a requested integrated PSD fraction by trapezoidal integration and within-bin linear-density inversion; not a percentile of frequency samples.",
  inputs: inputFields,
  outputs: [
    { id: "edgeFrequencyHz", label: "Edge frequency hz", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      frequenciesHz: value.frequenciesHz as readonly number[],
      powerDensity: value.powerDensity as readonly number[],
      powerFraction: value.powerFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
