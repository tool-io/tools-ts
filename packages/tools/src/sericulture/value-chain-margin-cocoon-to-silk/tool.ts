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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly cocoonInputKg: number;
  readonly cocoonPricePerKg: number;
  readonly rawSilkYieldFraction: number;
  readonly rawSilkPricePerKg: number;
  readonly byproductRevenue: number;
  readonly conversionCosts: readonly number[];
}>;
export type Output = Readonly<{
  readonly rawSilkOutputKg: number;
  readonly totalRevenue: number;
  readonly totalCost: number;
  readonly chainContribution: number;
  readonly contributionPerRawSilkKg: number;
}>;
const inputFields = [
  { id: "cocoonInputKg", label: "Cocoon input kg", kind: "number" },
  { id: "cocoonPricePerKg", label: "Cocoon price per kg", kind: "number" },
  {
    id: "rawSilkYieldFraction",
    label: "Raw silk yield fraction",
    kind: "number",
  },
  { id: "rawSilkPricePerKg", label: "Raw silk price per kg", kind: "number" },
  { id: "byproductRevenue", label: "Byproduct revenue", kind: "number" },
  { id: "conversionCosts", label: "Conversion costs", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.cocoonInputKg, "cocoonInputKg");
  positive(input.rawSilkYieldFraction, "rawSilkYieldFraction");
  nonnegative(input.cocoonPricePerKg, "cocoonPricePerKg");
  nonnegative(input.rawSilkPricePerKg, "rawSilkPricePerKg");
  nonnegative(input.byproductRevenue, "byproductRevenue");
  input.conversionCosts.forEach((v) => nonnegative(v, "conversionCosts"));
  fraction(input.rawSilkYieldFraction, "rawSilkYieldFraction");
  if (!input.conversionCosts.length)
    simpleError(
      "conversionCosts",
      "At least one explicit conversion cost required.",
    );
  const rawSilkOutputKg = input.cocoonInputKg * input.rawSilkYieldFraction,
    totalRevenue =
      rawSilkOutputKg * input.rawSilkPricePerKg + input.byproductRevenue,
    totalCost =
      input.cocoonInputKg * input.cocoonPricePerKg +
      input.conversionCosts.reduce((a, b) => a + b, 0),
    chainContribution = totalRevenue - totalCost;
  return {
    rawSilkOutputKg,
    totalRevenue,
    totalCost,
    chainContribution,
    contributionPerRawSilkKg: chainContribution / rawSilkOutputKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cocoonInputKg: 10,
  cocoonPricePerKg: 5,
  rawSilkYieldFraction: 0.2,
  rawSilkPricePerKg: 40,
  byproductRevenue: 5,
  conversionCosts: [10, 15],
} satisfies Input;
export const exampleOutput = {
  rawSilkOutputKg: 2,
  totalRevenue: 85,
  totalCost: 75,
  chainContribution: 10,
  contributionPerRawSilkKg: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/value-chain-margin-cocoon-to-silk",
  title: "Value Chain Margin Cocoon To Silk",
  description:
    "Balance cocoon purchase, explicit conversion costs, silk yield and byproducts into a signed cocoon-to-silk contribution; excludes unspecified capital/tax charges.",
  inputs: inputFields,
  outputs: [
    { id: "rawSilkOutputKg", label: "Raw silk output kg", kind: "number" },
    { id: "totalRevenue", label: "Total revenue", kind: "number" },
    { id: "totalCost", label: "Total cost", kind: "number" },
    { id: "chainContribution", label: "Chain contribution", kind: "number" },
    {
      id: "contributionPerRawSilkKg",
      label: "Contribution per raw silk kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cocoonInputKg: value.cocoonInputKg as number,
      cocoonPricePerKg: value.cocoonPricePerKg as number,
      rawSilkYieldFraction: value.rawSilkYieldFraction as number,
      rawSilkPricePerKg: value.rawSilkPricePerKg as number,
      byproductRevenue: value.byproductRevenue as number,
      conversionCosts: value.conversionCosts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
