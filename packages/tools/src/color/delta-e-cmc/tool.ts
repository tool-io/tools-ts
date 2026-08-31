import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, deltaCmc } from "../batch-shared.js";
export type Input = Readonly<{
  readonly referenceLab: readonly number[];
  readonly sampleLab: readonly number[];
  readonly lightnessWeight: number;
  readonly chromaWeight: number;
}>;
export type Output = Readonly<{
  readonly cmcReferenceWeightedDifference: number;
}>;
const inputFields = [
  { id: "referenceLab", label: "Reference lab", kind: "numberList" },
  { id: "sampleLab", label: "Sample lab", kind: "numberList" },
  { id: "lightnessWeight", label: "Lightness weight", kind: "number" },
  { id: "chromaWeight", label: "Chroma weight", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    cmcReferenceWeightedDifference: deltaCmc(
      input.referenceLab,
      input.sampleLab,
      input.lightnessWeight,
      input.chromaWeight,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceLab: [10, 0, 0],
  sampleLab: [11, 0, 0],
  lightnessWeight: 2,
  chromaWeight: 1,
} satisfies Input;
export const exampleOutput = {
  cmcReferenceWeightedDifference: 0.9784735812133072,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/delta-e-cmc",
  title: "Delta E CMC Calculator",
  description:
    "Compute asymmetric CMC l:c same-white CIELAB difference with caller positive lightness/chroma weights; reference/sample direction matters and l:c choice does not certify color acceptability.",
  inputs: inputFields,
  outputs: [
    {
      id: "cmcReferenceWeightedDifference",
      label: "Cmc reference weighted difference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceLab: value.referenceLab as readonly number[],
      sampleLab: value.sampleLab as readonly number[],
      lightnessWeight: value.lightnessWeight as number,
      chromaWeight: value.chromaWeight as number,
    }),
});
export const run = tool.execute;
export default tool;
