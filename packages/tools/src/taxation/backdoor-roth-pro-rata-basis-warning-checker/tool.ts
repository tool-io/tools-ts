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
  readonly aggregatePretaxIraMinor: number;
  readonly aggregateAftertaxBasisMinor: number;
  readonly conversionMinor: number;
}>;
export type Output = Readonly<{
  readonly conditionalTaxableConversionMinor: number;
  readonly pretaxAggregationWarning: boolean;
}>;
const inputFields = [
  {
    id: "aggregatePretaxIraMinor",
    label: "Aggregate pretax ira minor",
    kind: "number",
  },
  {
    id: "aggregateAftertaxBasisMinor",
    label: "Aggregate aftertax basis minor",
    kind: "number",
  },
  { id: "conversionMinor", label: "Conversion minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.aggregatePretaxIraMinor, "aggregatePretaxIraMinor");
  money(input.aggregateAftertaxBasisMinor, "aggregateAftertaxBasisMinor");
  money(input.conversionMinor, "conversionMinor");
  const t = sumMoney([
    input.aggregatePretaxIraMinor,
    input.aggregateAftertaxBasisMinor,
  ]);
  positive(t, "aggregateIRA");
  if (input.conversionMinor > t)
    simpleError(
      "conversion",
      "Conversion≤complete independently matched aggregate base.",
    );
  return {
    conditionalTaxableConversionMinor: roundMinor(
      BigInt(input.conversionMinor) * BigInt(input.aggregatePretaxIraMinor),
      BigInt(t),
    ),
    pretaxAggregationWarning:
      input.aggregatePretaxIraMinor > 0 &&
      input.aggregateAftertaxBasisMinor > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  aggregatePretaxIraMinor: 80,
  aggregateAftertaxBasisMinor: 20,
  conversionMinor: 50,
} satisfies Input;
export const exampleOutput = {
  conditionalTaxableConversionMinor: 40,
  pretaxAggregationWarning: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/backdoor-roth-pro-rata-basis-warning-checker",
  title: "Backdoor Roth Pro Rata Basis Warning Checker",
  description:
    "Backdoor Roth complete caller year-end IRA pretax/basis aggregation warning and conditional conversion share, not pretax exclusion from account label. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalTaxableConversionMinor",
      label: "Conditional taxable conversion minor",
      kind: "number",
    },
    {
      id: "pretaxAggregationWarning",
      label: "Pretax aggregation warning",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      aggregatePretaxIraMinor: value.aggregatePretaxIraMinor as number,
      aggregateAftertaxBasisMinor: value.aggregateAftertaxBasisMinor as number,
      conversionMinor: value.conversionMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
