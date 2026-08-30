import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly analyteMicrogramsPerLiter: readonly number[];
  readonly creatinineGramsPerLiter: readonly number[];
  readonly specificGravities: readonly number[];
  readonly referenceSpecificGravity: number;
}>;
export type Output = Readonly<{
  readonly creatinineAdjustedMicrogramsPerGram: readonly number[];
  readonly sgAdjustedMicrogramsPerLiter: readonly number[];
}>;
const inputFields = [
  {
    id: "analyteMicrogramsPerLiter",
    label: "Analyte micrograms per liter",
    kind: "numberList",
  },
  {
    id: "creatinineGramsPerLiter",
    label: "Creatinine grams per liter",
    kind: "numberList",
  },
  { id: "specificGravities", label: "Specific gravities", kind: "numberList" },
  {
    id: "referenceSpecificGravity",
    label: "Reference specific gravity",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.analyteMicrogramsPerLiter,
    input.creatinineGramsPerLiter,
    "analyteMicrogramsPerLiter",
  );
  aligned(
    input.analyteMicrogramsPerLiter,
    input.specificGravities,
    "analyteMicrogramsPerLiter",
  );
  input.analyteMicrogramsPerLiter.forEach((v) =>
    nonnegative(v, "analyteMicrogramsPerLiter"),
  );
  input.creatinineGramsPerLiter.forEach((v) =>
    positive(v, "creatinineGramsPerLiter"),
  );
  if (
    input.referenceSpecificGravity <= 1 ||
    input.specificGravities.some((v) => v <= 1)
  )
    simpleError("specificGravities", "Specific gravities above one required.");
  return {
    creatinineAdjustedMicrogramsPerGram: input.analyteMicrogramsPerLiter.map(
      (v, i) => v / input.creatinineGramsPerLiter[i],
    ),
    sgAdjustedMicrogramsPerLiter: input.analyteMicrogramsPerLiter.map(
      (v, i) =>
        (v * (input.referenceSpecificGravity - 1)) /
        (input.specificGravities[i] - 1),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  analyteMicrogramsPerLiter: [10, 20],
  creatinineGramsPerLiter: [0.5, 2],
  specificGravities: [1.01, 1.02],
  referenceSpecificGravity: 1.02,
} satisfies Input;
export const exampleOutput = {
  creatinineAdjustedMicrogramsPerGram: [20, 10],
  sgAdjustedMicrogramsPerLiter: [20, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/urinary-biomarker-dilution-adjustment",
  title: "Urinary Biomarker",
  description:
    "Compare creatinine-normalized and specific-gravity-normalized urinary biomarker values using caller reference SG; these corrections do not estimate exposure or set biological limits.",
  inputs: inputFields,
  outputs: [
    {
      id: "creatinineAdjustedMicrogramsPerGram",
      label: "Creatinine adjusted micrograms per gram",
      kind: "numberList",
    },
    {
      id: "sgAdjustedMicrogramsPerLiter",
      label: "Sg adjusted micrograms per liter",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      analyteMicrogramsPerLiter:
        value.analyteMicrogramsPerLiter as readonly number[],
      creatinineGramsPerLiter:
        value.creatinineGramsPerLiter as readonly number[],
      specificGravities: value.specificGravities as readonly number[],
      referenceSpecificGravity: value.referenceSpecificGravity as number,
    }),
});
export const run = tool.execute;
export default tool;
