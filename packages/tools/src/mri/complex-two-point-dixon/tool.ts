import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly inPhaseReal: readonly number[];
  readonly inPhaseImaginary: readonly number[];
  readonly opposedPhaseReal: readonly number[];
  readonly opposedPhaseImaginary: readonly number[];
}>;
export type Output = Readonly<{
  readonly waterReal: readonly number[];
  readonly waterImaginary: readonly number[];
  readonly fatReal: readonly number[];
  readonly fatImaginary: readonly number[];
}>;
const inputFields = [
  { id: "inPhaseReal", label: "In phase real", kind: "numberList" },
  { id: "inPhaseImaginary", label: "In phase imaginary", kind: "numberList" },
  { id: "opposedPhaseReal", label: "Opposed phase real", kind: "numberList" },
  {
    id: "opposedPhaseImaginary",
    label: "Opposed phase imaginary",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.inPhaseReal, input.inPhaseImaginary, "inPhaseReal");
  aligned(input.inPhaseReal, input.opposedPhaseReal, "inPhaseReal");
  aligned(input.inPhaseReal, input.opposedPhaseImaginary, "inPhaseReal");
  return {
    waterReal: input.inPhaseReal.map(
      (v, i) => (v + input.opposedPhaseReal[i]) / 2,
    ),
    waterImaginary: input.inPhaseImaginary.map(
      (v, i) => (v + input.opposedPhaseImaginary[i]) / 2,
    ),
    fatReal: input.inPhaseReal.map(
      (v, i) => (v - input.opposedPhaseReal[i]) / 2,
    ),
    fatImaginary: input.inPhaseImaginary.map(
      (v, i) => (v - input.opposedPhaseImaginary[i]) / 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inPhaseReal: [10],
  inPhaseImaginary: [2],
  opposedPhaseReal: [6],
  opposedPhaseImaginary: [0],
} satisfies Input;
export const exampleOutput = {
  waterReal: [8],
  waterImaginary: [1],
  fatReal: [2],
  fatImaginary: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/complex-two-point-dixon",
  title: "Dixon Water Fat Separation",
  description:
    "Separate ideal complex in-phase/opposed-phase signals into water=(IP+OP)/2 and fat=(IP−OP)/2; assumes corrected common phase and a single fat peak, not magnitude-only Dixon or B0 solving.",
  inputs: inputFields,
  outputs: [
    { id: "waterReal", label: "Water real", kind: "numberList" },
    { id: "waterImaginary", label: "Water imaginary", kind: "numberList" },
    { id: "fatReal", label: "Fat real", kind: "numberList" },
    { id: "fatImaginary", label: "Fat imaginary", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      inPhaseReal: value.inPhaseReal as readonly number[],
      inPhaseImaginary: value.inPhaseImaginary as readonly number[],
      opposedPhaseReal: value.opposedPhaseReal as readonly number[],
      opposedPhaseImaginary: value.opposedPhaseImaginary as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
