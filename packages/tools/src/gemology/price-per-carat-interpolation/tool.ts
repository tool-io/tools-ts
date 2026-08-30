import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceCaratMasses: readonly number[];
  readonly quotedRatesPerCarat: readonly number[];
  readonly sampleCaratMass: number;
}>;
export type Output = Readonly<{
  readonly interpolatedQuotedRatePerCarat: number;
  readonly interpolatedTotalStoneQuote: number;
}>;
const inputFields = [
  {
    id: "referenceCaratMasses",
    label: "Reference carat masses",
    kind: "numberList",
  },
  {
    id: "quotedRatesPerCarat",
    label: "Quoted rates per carat",
    kind: "numberList",
  },
  { id: "sampleCaratMass", label: "Sample carat mass", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.referenceCaratMasses.forEach((v) =>
    positive(v, "referenceCaratMasses"),
  );
  positive(input.sampleCaratMass, "sampleCaratMass");
  input.quotedRatesPerCarat.forEach((v) =>
    nonnegative(v, "quotedRatesPerCarat"),
  );
  const interpolatedQuotedRatePerCarat = interpolate(
    input.referenceCaratMasses,
    input.quotedRatesPerCarat,
    input.sampleCaratMass,
  );
  return {
    interpolatedQuotedRatePerCarat,
    interpolatedTotalStoneQuote:
      interpolatedQuotedRatePerCarat * input.sampleCaratMass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceCaratMasses: [1, 2, 3],
  quotedRatesPerCarat: [100, 200, 400],
  sampleCaratMass: 1.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedQuotedRatePerCarat: 150,
  interpolatedTotalStoneQuote: 225,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/price-per-carat-interpolation",
  title: "Price Per Carat Interpolation",
  description:
    "Interpolate caller comparable per-carat quotations within observed mass calibration and compute total quote; no live market catalog, implicit magic-size smoothing approval or appraisal assertion.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedQuotedRatePerCarat",
      label: "Interpolated quoted rate per carat",
      kind: "number",
    },
    {
      id: "interpolatedTotalStoneQuote",
      label: "Interpolated total stone quote",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceCaratMasses: value.referenceCaratMasses as readonly number[],
      quotedRatesPerCarat: value.quotedRatesPerCarat as readonly number[],
      sampleCaratMass: value.sampleCaratMass as number,
    }),
});
export const run = tool.execute;
export default tool;
