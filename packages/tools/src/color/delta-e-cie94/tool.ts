import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, delta94 } from "../batch-shared.js";
export type Input = Readonly<{
  readonly referenceLab: readonly number[];
  readonly sampleLab: readonly number[];
  readonly textileApplication: boolean;
}>;
export type Output = Readonly<{
  readonly cie94ReferenceWeightedDifference: number;
}>;
const inputFields = [
  { id: "referenceLab", label: "Reference lab", kind: "numberList" },
  { id: "sampleLab", label: "Sample lab", kind: "numberList" },
  { id: "textileApplication", label: "Textile application", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    cie94ReferenceWeightedDifference: delta94(
      input.referenceLab,
      input.sampleLab,
      input.textileApplication,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceLab: [50, 0, 0],
  sampleLab: [60, 0, 0],
  textileApplication: false,
} satisfies Input;
export const exampleOutput = {
  cie94ReferenceWeightedDifference: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/delta-e-cie94",
  title: "Delta E CIE94 Calculator",
  description:
    "Compute reference-weighted CIE94 on same-white caller CIELAB using graphics/textile constants; asymmetric reference weighting is preserved, not a CIE76 alias or a universal acceptability threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "cie94ReferenceWeightedDifference",
      label: "Cie94 reference weighted difference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceLab: value.referenceLab as readonly number[],
      sampleLab: value.sampleLab as readonly number[],
      textileApplication: value.textileApplication as boolean,
    }),
});
export const run = tool.execute;
export default tool;
