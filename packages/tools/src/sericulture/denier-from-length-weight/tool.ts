import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleLengthsM: readonly number[];
  readonly sampleMassesGrams: readonly number[];
}>;
export type Output = Readonly<{
  readonly sampleDeniers: readonly number[];
  readonly pooledDenier: number;
}>;
const inputFields = [
  { id: "sampleLengthsM", label: "Sample lengths m", kind: "numberList" },
  { id: "sampleMassesGrams", label: "Sample masses grams", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleLengthsM.forEach((v) => positive(v, "sampleLengthsM"));
  input.sampleMassesGrams.forEach((v) => nonnegative(v, "sampleMassesGrams"));
  aligned(input.sampleLengthsM, input.sampleMassesGrams, "sampleLengthsM");
  return {
    sampleDeniers: input.sampleMassesGrams.map(
      (v, i) => (9000 * v) / input.sampleLengthsM[i],
    ),
    pooledDenier:
      (9000 * input.sampleMassesGrams.reduce((a, b) => a + b, 0)) /
      input.sampleLengthsM.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleLengthsM: [100, 200],
  sampleMassesGrams: [0.1, 0.4],
} satisfies Input;
export const exampleOutput = {
  sampleDeniers: [9, 18],
  pooledDenier: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/denier-from-length-weight",
  title: "Denier From Length Weight",
  description:
    "Infer filament denier as grams per 9000 meters, returning sample values and length-weighted pooled linear density; redundant denier/tex conversion aliases excluded.",
  inputs: inputFields,
  outputs: [
    { id: "sampleDeniers", label: "Sample deniers", kind: "numberList" },
    { id: "pooledDenier", label: "Pooled denier", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sampleLengthsM: value.sampleLengthsM as readonly number[],
      sampleMassesGrams: value.sampleMassesGrams as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
