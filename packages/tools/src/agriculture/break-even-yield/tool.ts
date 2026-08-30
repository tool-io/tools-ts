import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly fixedEnterpriseCostPerHa: number;
  readonly netSalePricePerKg: number;
  readonly yieldLinkedVariableCostPerKg: number;
  readonly marketableYieldFraction: number;
}>;
export type Output = Readonly<{
  readonly netContributionPerHarvestedKg: number;
  readonly breakEvenHarvestedYieldKgPerHa: number;
  readonly breakEvenMarketableYieldKgPerHa: number;
}>;
const inputFields = [
  {
    id: "fixedEnterpriseCostPerHa",
    label: "Fixed enterprise cost per ha",
    kind: "number",
  },
  { id: "netSalePricePerKg", label: "Net sale price per kg", kind: "number" },
  {
    id: "yieldLinkedVariableCostPerKg",
    label: "Yield linked variable cost per kg",
    kind: "number",
  },
  {
    id: "marketableYieldFraction",
    label: "Marketable yield fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.netSalePricePerKg, "netSalePricePerKg");
  positive(input.marketableYieldFraction, "marketableYieldFraction");
  nonnegative(input.fixedEnterpriseCostPerHa, "fixedEnterpriseCostPerHa");
  nonnegative(
    input.yieldLinkedVariableCostPerKg,
    "yieldLinkedVariableCostPerKg",
  );
  fraction(input.marketableYieldFraction, "marketableYieldFraction");
  const netContributionPerHarvestedKg = positive(
      input.netSalePricePerKg * input.marketableYieldFraction -
        input.yieldLinkedVariableCostPerKg,
      "netContribution",
    ),
    breakEvenHarvestedYieldKgPerHa =
      input.fixedEnterpriseCostPerHa / netContributionPerHarvestedKg;
  return {
    netContributionPerHarvestedKg,
    breakEvenHarvestedYieldKgPerHa,
    breakEvenMarketableYieldKgPerHa:
      breakEvenHarvestedYieldKgPerHa * input.marketableYieldFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fixedEnterpriseCostPerHa: 100,
  netSalePricePerKg: 2,
  yieldLinkedVariableCostPerKg: 0.5,
  marketableYieldFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  netContributionPerHarvestedKg: 0.5,
  breakEvenHarvestedYieldKgPerHa: 200,
  breakEvenMarketableYieldKgPerHa: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/break-even-yield",
  title: "Agriculture Break Even Yield",
  description:
    "Invert fixed area cost against caller marketable share and yield-linked variable contribution, distinguishing harvested from sellable break-even yield; zero/negative contribution has no finite break-even, with no price forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "netContributionPerHarvestedKg",
      label: "Net contribution per harvested kg",
      kind: "number",
    },
    {
      id: "breakEvenHarvestedYieldKgPerHa",
      label: "Break even harvested yield kg per ha",
      kind: "number",
    },
    {
      id: "breakEvenMarketableYieldKgPerHa",
      label: "Break even marketable yield kg per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fixedEnterpriseCostPerHa: value.fixedEnterpriseCostPerHa as number,
      netSalePricePerKg: value.netSalePricePerKg as number,
      yieldLinkedVariableCostPerKg:
        value.yieldLinkedVariableCostPerKg as number,
      marketableYieldFraction: value.marketableYieldFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
