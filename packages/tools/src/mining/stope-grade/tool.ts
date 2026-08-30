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
  readonly sampleDensitiesTonnesPerM3: readonly number[];
  readonly sampleGrades: readonly number[];
}>;
export type Output = Readonly<{
  readonly densityLengthWeightedGrade: number;
  readonly lengthWeightedGrade: number;
}>;
const inputFields = [
  { id: "sampleLengthsM", label: "Sample lengths m", kind: "numberList" },
  {
    id: "sampleDensitiesTonnesPerM3",
    label: "Sample densities tonnes per m3",
    kind: "numberList",
  },
  { id: "sampleGrades", label: "Sample grades", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleLengthsM.forEach((v) => positive(v, "sampleLengthsM"));
  input.sampleDensitiesTonnesPerM3.forEach((v) =>
    positive(v, "sampleDensitiesTonnesPerM3"),
  );
  input.sampleGrades.forEach((v) => nonnegative(v, "sampleGrades"));
  aligned(
    input.sampleLengthsM,
    input.sampleDensitiesTonnesPerM3,
    "sampleLengthsM",
  );
  aligned(input.sampleLengthsM, input.sampleGrades, "sampleLengthsM");
  const weights = input.sampleLengthsM.map(
    (v, i) => v * input.sampleDensitiesTonnesPerM3[i],
  );
  return {
    densityLengthWeightedGrade:
      weights.reduce((s, v, i) => s + v * input.sampleGrades[i], 0) /
      weights.reduce((a, b) => a + b, 0),
    lengthWeightedGrade:
      input.sampleLengthsM.reduce(
        (s, v, i) => s + v * input.sampleGrades[i],
        0,
      ) / input.sampleLengthsM.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleLengthsM: [1, 2],
  sampleDensitiesTonnesPerM3: [2, 3],
  sampleGrades: [1, 4],
} satisfies Input;
export const exampleOutput = {
  densityLengthWeightedGrade: 3.25,
  lengthWeightedGrade: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/stope-grade",
  title: "Stope Grade",
  description:
    "Composite representative constant-area stope intervals with length and density×length weights; not ore/diluent mixing.",
  inputs: inputFields,
  outputs: [
    {
      id: "densityLengthWeightedGrade",
      label: "Density length weighted grade",
      kind: "number",
    },
    {
      id: "lengthWeightedGrade",
      label: "Length weighted grade",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleLengthsM: value.sampleLengthsM as readonly number[],
      sampleDensitiesTonnesPerM3:
        value.sampleDensitiesTonnesPerM3 as readonly number[],
      sampleGrades: value.sampleGrades as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
