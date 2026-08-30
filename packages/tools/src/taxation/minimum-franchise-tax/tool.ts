import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly taxableBase: number;
  readonly taxRatePercent: number;
  readonly minimumTax: number;
}>;
export type Output = Readonly<{
  readonly calculatedTax: number;
  readonly taxDue: number;
}>;

export const calculate = (input: Input): Output => {
  const calculatedTax = (input.taxableBase * input.taxRatePercent) / 100;
  return { calculatedTax, taxDue: Math.max(calculatedTax, input.minimumTax) };
};

export const exampleInput = {
  taxableBase: 10000,
  taxRatePercent: 5,
  minimumTax: 800,
} satisfies Input;
export const exampleOutput = {
  calculatedTax: 500,
  taxDue: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      taxableBase: input.taxableBase as number,
      taxRatePercent: input.taxRatePercent as number,
      minimumTax: input.minimumTax as number,
    }),
  description:
    "Calculate percentage-based franchise tax and apply a caller-supplied minimum.",
  id: "taxation/minimum-franchise-tax",
  inputs: [
    {
      id: "taxableBase",
      label: "Taxable base",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "taxRatePercent",
      label: "Tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "minimumTax",
      label: "Minimum tax",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "calculatedTax",
      label: "Calculated percentage tax",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "taxDue",
      label: "Tax due after minimum",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Minimum Franchise Tax",
});

export const run = tool.execute;
export default tool;
