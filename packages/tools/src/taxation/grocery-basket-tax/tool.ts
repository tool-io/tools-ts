import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly exemptGroceries: number;
  readonly reducedRateGroceries: number;
  readonly standardRateGroceries: number;
  readonly reducedRatePercent: number;
  readonly standardRatePercent: number;
}>;
export type Output = Readonly<{
  readonly reducedRateTax: number;
  readonly standardRateTax: number;
  readonly totalBasketTax: number;
  readonly effectiveRatePercent: number;
}>;

export const calculate = (input: Input): Output => {
  const reducedRateTax =
    (input.reducedRateGroceries * input.reducedRatePercent) / 100;
  const standardRateTax =
    (input.standardRateGroceries * input.standardRatePercent) / 100;
  const total =
    input.exemptGroceries +
    input.reducedRateGroceries +
    input.standardRateGroceries;
  return {
    reducedRateTax,
    standardRateTax,
    totalBasketTax: reducedRateTax + standardRateTax,
    effectiveRatePercent:
      total === 0 ? 0 : ((reducedRateTax + standardRateTax) / total) * 100,
  };
};

export const exampleInput = {
  exemptGroceries: 100,
  reducedRateGroceries: 100,
  standardRateGroceries: 100,
  reducedRatePercent: 5,
  standardRatePercent: 10,
} satisfies Input;
export const exampleOutput = {
  reducedRateTax: 5,
  standardRateTax: 10,
  totalBasketTax: 15,
  effectiveRatePercent: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      exemptGroceries: input.exemptGroceries as number,
      reducedRateGroceries: input.reducedRateGroceries as number,
      standardRateGroceries: input.standardRateGroceries as number,
      reducedRatePercent: input.reducedRatePercent as number,
      standardRatePercent: input.standardRatePercent as number,
    }),
  description:
    "Calculate mixed grocery-basket tax across exempt, reduced, and standard categories.",
  id: "taxation/grocery-basket-tax",
  inputs: [
    {
      id: "exemptGroceries",
      label: "Exempt grocery subtotal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reducedRateGroceries",
      label: "Reduced-rate grocery subtotal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "standardRateGroceries",
      label: "Standard-rate grocery subtotal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reducedRatePercent",
      label: "Reduced tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "standardRatePercent",
      label: "Standard tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "reducedRateTax",
      label: "Reduced-rate tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "standardRateTax",
      label: "Standard-rate tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "totalBasketTax",
      label: "Total basket tax",
      kind: "number",
      minimum: 0,
    },
    {
      id: "effectiveRatePercent",
      label: "Basket effective rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Grocery Basket Tax",
});

export const run = tool.execute;
export default tool;
