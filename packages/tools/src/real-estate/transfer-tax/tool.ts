import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransferTaxInput = Readonly<{
  readonly taxableValue: number;
  readonly ratePercent: number;
}>;
export type TransferTaxOutput = Readonly<{
  readonly transferTax: number;
}>;

export const calculateTransferTax = (
  x: TransferTaxInput,
): TransferTaxOutput => {
  if (!Number.isFinite(x.taxableValue) || x.taxableValue < 0)
    simpleError("taxableValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.ratePercent) || x.ratePercent < 0)
    simpleError("ratePercent", "Provide a finite nonnegative number.");
  const transferTax = (x.taxableValue * x.ratePercent) / 100;
  if (!Number.isFinite(transferTax))
    simpleError(
      "transferTax",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { transferTax: Object.is(transferTax, -0) ? 0 : transferTax };
};

export const example = {
  input: {
    taxableValue: 200000,
    ratePercent: 1,
  },
  output: { transferTax: 2000 },
} satisfies ToolExample<TransferTaxInput, TransferTaxOutput>;

export const tool = createSimpleTool({
  id: "real-estate/transfer-tax",
  title: "Transfer Tax",
  description:
    "Transfer tax arithmetic from taxable transaction value and user-supplied local tax rate; no jurisdictional determination.",
  inputs: [
    {
      id: "taxableValue",
      kind: "number",
      label: "Taxable Value",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "ratePercent",
      kind: "number",
      label: "Rate Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "transferTax",
      kind: "number",
      label: "Transfer Tax",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateTransferTax({
      taxableValue: input.taxableValue as number,
      ratePercent: input.ratePercent as number,
    }),
});
export const transferTaxTool = tool;
export const runTransferTax = tool.execute;
export default tool;
