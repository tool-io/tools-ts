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
  money,
  sumMoney,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly completeYearEndIraValueMinor: number;
  readonly yearDistributionsAndConversionsMinor: number;
  readonly unrecoveredAftertaxBasisMinor: number;
  readonly conversionAmountMinor: number;
}>;
export type Output = Readonly<{
  readonly conditionalNontaxableConversionMinor: number;
  readonly conditionalTaxableConversionMinor: number;
}>;
const inputFields = [
  {
    id: "completeYearEndIraValueMinor",
    label: "Complete year end ira value minor",
    kind: "number",
  },
  {
    id: "yearDistributionsAndConversionsMinor",
    label: "Year distributions and conversions minor",
    kind: "number",
  },
  {
    id: "unrecoveredAftertaxBasisMinor",
    label: "Unrecovered aftertax basis minor",
    kind: "number",
  },
  {
    id: "conversionAmountMinor",
    label: "Conversion amount minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.completeYearEndIraValueMinor, "completeYearEndIraValueMinor");
  money(
    input.yearDistributionsAndConversionsMinor,
    "yearDistributionsAndConversionsMinor",
  );
  money(input.unrecoveredAftertaxBasisMinor, "unrecoveredAftertaxBasisMinor");
  money(input.conversionAmountMinor, "conversionAmountMinor");
  const t = sumMoney([
    input.completeYearEndIraValueMinor,
    input.yearDistributionsAndConversionsMinor,
  ]);
  positive(t, "aggregate base");
  if (
    input.unrecoveredAftertaxBasisMinor > t ||
    input.conversionAmountMinor > input.yearDistributionsAndConversionsMinor
  )
    simpleError("base", "Basis≤aggregate, conversion≤all-year distributions.");
  const b = roundMinor(
    BigInt(input.conversionAmountMinor) *
      BigInt(input.unrecoveredAftertaxBasisMinor),
    BigInt(t),
  );
  return {
    conditionalNontaxableConversionMinor: b,
    conditionalTaxableConversionMinor: input.conversionAmountMinor - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  completeYearEndIraValueMinor: 80,
  yearDistributionsAndConversionsMinor: 20,
  unrecoveredAftertaxBasisMinor: 25,
  conversionAmountMinor: 20,
} satisfies Input;
export const exampleOutput = {
  conditionalNontaxableConversionMinor: 5,
  conditionalTaxableConversionMinor: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/pro-rata-rule-conversion-taxed-share-calculator",
  title: "Pro Rata Rule Conversion Taxed Share Calculator",
  description:
    "Form8606style complete year-endPLUSyear distributions pro-rata denominator, distinct from supplied pretax/basis static warning; sequencing/exceptions externally established. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalNontaxableConversionMinor",
      label: "Conditional nontaxable conversion minor",
      kind: "number",
    },
    {
      id: "conditionalTaxableConversionMinor",
      label: "Conditional taxable conversion minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      completeYearEndIraValueMinor:
        value.completeYearEndIraValueMinor as number,
      yearDistributionsAndConversionsMinor:
        value.yearDistributionsAndConversionsMinor as number,
      unrecoveredAftertaxBasisMinor:
        value.unrecoveredAftertaxBasisMinor as number,
      conversionAmountMinor: value.conversionAmountMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
