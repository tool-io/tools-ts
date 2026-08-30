import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roomCharges: number;
  readonly taxableFees: number;
  readonly lodgingTaxRatePercent: number;
}>;
export type Output = Readonly<{
  readonly taxableLodgingAmount: number;
  readonly lodgingTax: number;
  readonly totalCharge: number;
}>;

export const calculate = (input: Input): Output => {
  const taxableLodgingAmount = input.roomCharges + input.taxableFees;
  const lodgingTax = (taxableLodgingAmount * input.lodgingTaxRatePercent) / 100;
  return {
    taxableLodgingAmount,
    lodgingTax,
    totalCharge: taxableLodgingAmount + lodgingTax,
  };
};

export const exampleInput = {
  roomCharges: 900,
  taxableFees: 100,
  lodgingTaxRatePercent: 10,
} satisfies Input;
export const exampleOutput = {
  taxableLodgingAmount: 1000,
  lodgingTax: 100,
  totalCharge: 1100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      roomCharges: input.roomCharges as number,
      taxableFees: input.taxableFees as number,
      lodgingTaxRatePercent: input.lodgingTaxRatePercent as number,
    }),
  description:
    "Calculate caller-parameterized lodging tax on room charges and taxable fees.",
  id: "taxation/lodging-tax",
  inputs: [
    { id: "roomCharges", label: "Room charges", kind: "number", minimum: 0 },
    {
      id: "taxableFees",
      label: "Taxable lodging fees",
      kind: "number",
      minimum: 0,
    },
    {
      id: "lodgingTaxRatePercent",
      label: "Lodging tax rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "taxableLodgingAmount",
      label: "Taxable lodging amount",
      kind: "number",
      minimum: 0,
    },
    { id: "lodgingTax", label: "Lodging tax", kind: "number", minimum: 0 },
    { id: "totalCharge", label: "Total charge", kind: "number", minimum: 0 },
  ],
  title: "Lodging Tax",
});

export const run = tool.execute;
export default tool;
