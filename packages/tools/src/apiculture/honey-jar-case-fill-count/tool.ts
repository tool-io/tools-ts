import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly honeyMassKg: number;
  readonly packagingLossFraction: number;
  readonly nominalJarFillGrams: number;
  readonly overfillGrams: number;
  readonly jarsPerCase: number;
}>;
export type Output = Readonly<{
  readonly fullJarCount: number;
  readonly fullCaseCount: number;
  readonly looseJarCount: number;
  readonly remainingHoneyKg: number;
}>;
const inputFields = [
  { id: "honeyMassKg", label: "Honey mass kg", kind: "number" },
  {
    id: "packagingLossFraction",
    label: "Packaging loss fraction",
    kind: "number",
  },
  {
    id: "nominalJarFillGrams",
    label: "Nominal jar fill grams",
    kind: "number",
  },
  { id: "overfillGrams", label: "Overfill grams", kind: "number" },
  { id: "jarsPerCase", label: "Jars per case", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.nominalJarFillGrams, "nominalJarFillGrams");
  positive(input.jarsPerCase, "jarsPerCase");
  nonnegative(input.honeyMassKg, "honeyMassKg");
  nonnegative(input.overfillGrams, "overfillGrams");
  fraction(input.packagingLossFraction, "packagingLossFraction");
  count(input.jarsPerCase, "jarsPerCase");
  const available =
      input.honeyMassKg * (1 - input.packagingLossFraction) * 1000,
    fill = input.nominalJarFillGrams + input.overfillGrams,
    fullJarCount = count(Math.floor(available / fill), "fullJarCount");
  return {
    fullJarCount,
    fullCaseCount: Math.floor(fullJarCount / input.jarsPerCase),
    looseJarCount: fullJarCount % input.jarsPerCase,
    remainingHoneyKg: (available - fullJarCount * fill) / 1000,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  honeyMassKg: 10,
  packagingLossFraction: 0.1,
  nominalJarFillGrams: 200,
  overfillGrams: 10,
  jarsPerCase: 12,
} satisfies Input;
export const exampleOutput = {
  fullJarCount: 42,
  fullCaseCount: 3,
  looseJarCount: 6,
  remainingHoneyKg: 0.18,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/honey-jar-case-fill-count",
  title: "Honey Jar Case Fill Count",
  description:
    "Plan complete jars/cases from usable honey including measured overfill and loss; incomplete jars are excluded, and legal net-content compliance is external.",
  inputs: inputFields,
  outputs: [
    { id: "fullJarCount", label: "Full jar count", kind: "number" },
    { id: "fullCaseCount", label: "Full case count", kind: "number" },
    { id: "looseJarCount", label: "Loose jar count", kind: "number" },
    { id: "remainingHoneyKg", label: "Remaining honey kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      honeyMassKg: value.honeyMassKg as number,
      packagingLossFraction: value.packagingLossFraction as number,
      nominalJarFillGrams: value.nominalJarFillGrams as number,
      overfillGrams: value.overfillGrams as number,
      jarsPerCase: value.jarsPerCase as number,
    }),
});
export const run = tool.execute;
export default tool;
