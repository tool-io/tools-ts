import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly contactMassMgPerSquareCm: readonly number[];
  readonly contactAreasSquareCm: readonly number[];
  readonly absorbedFractions: readonly number[];
  readonly bodyMassKg: number;
}>;
export type Output = Readonly<{
  readonly segmentAbsorbedMassMg: readonly number[];
  readonly absorbedDoseMgPerKg: number;
}>;
const inputFields = [
  {
    id: "contactMassMgPerSquareCm",
    label: "Contact mass mg per square cm",
    kind: "numberList",
  },
  {
    id: "contactAreasSquareCm",
    label: "Contact areas square cm",
    kind: "numberList",
  },
  { id: "absorbedFractions", label: "Absorbed fractions", kind: "numberList" },
  { id: "bodyMassKg", label: "Body mass kg", kind: "number", unit: "kg" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.contactMassMgPerSquareCm,
    input.contactAreasSquareCm,
    "contactMassMgPerSquareCm",
  );
  aligned(
    input.contactMassMgPerSquareCm,
    input.absorbedFractions,
    "contactMassMgPerSquareCm",
  );
  input.contactMassMgPerSquareCm.forEach((v) =>
    nonnegative(v, "contactMassMgPerSquareCm"),
  );
  input.contactAreasSquareCm.forEach((v) =>
    nonnegative(v, "contactAreasSquareCm"),
  );
  input.absorbedFractions.forEach((v) => fraction(v, "absorbedFractions"));
  positive(input.bodyMassKg, "bodyMassKg");
  const segmentAbsorbedMassMg = input.contactMassMgPerSquareCm.map(
    (v, i) => v * input.contactAreasSquareCm[i] * input.absorbedFractions[i],
  );
  return {
    segmentAbsorbedMassMg,
    absorbedDoseMgPerKg:
      segmentAbsorbedMassMg.reduce((a, b) => a + b, 0) / input.bodyMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contactMassMgPerSquareCm: [0.1, 0.2],
  contactAreasSquareCm: [100, 50],
  absorbedFractions: [0.1, 0.2],
  bodyMassKg: 50,
} satisfies Input;
export const exampleOutput = {
  segmentAbsorbedMassMg: [1, 2],
  absorbedDoseMgPerKg: 0.06,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/dermal-contact-absorbed-dose",
  title: "Dermal Absorption Dose",
  description:
    "Integrate supplied dermal contact loadings, distinct contact areas and absorbed fractions into mass-normalized dose; overlapping contact areas and time integration must be resolved externally.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentAbsorbedMassMg",
      label: "Segment absorbed mass mg",
      kind: "numberList",
    },
    {
      id: "absorbedDoseMgPerKg",
      label: "Absorbed dose mg per kg",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (value) =>
    calculate({
      contactMassMgPerSquareCm:
        value.contactMassMgPerSquareCm as readonly number[],
      contactAreasSquareCm: value.contactAreasSquareCm as readonly number[],
      absorbedFractions: value.absorbedFractions as readonly number[],
      bodyMassKg: value.bodyMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
