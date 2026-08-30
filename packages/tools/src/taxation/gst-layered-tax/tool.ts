import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transferAmount: number;
  readonly availableExemption: number;
  readonly gstRatePercent: number;
  readonly otherTransferTax: number;
}>;
export type Output = Readonly<{
  readonly taxableGstTransfer: number;
  readonly gstTax: number;
  readonly combinedTransferTax: number;
}>;

export const calculate = (input: Input): Output => {
  const taxableGstTransfer = Math.max(
    0,
    input.transferAmount - input.availableExemption,
  );
  const gstTax = (taxableGstTransfer * input.gstRatePercent) / 100;
  return {
    taxableGstTransfer,
    gstTax,
    combinedTransferTax: gstTax + input.otherTransferTax,
  };
};

export const exampleInput = {
  transferAmount: 1000,
  availableExemption: 400,
  gstRatePercent: 40,
  otherTransferTax: 100,
} satisfies Input;
export const exampleOutput = {
  taxableGstTransfer: 600,
  gstTax: 240,
  combinedTransferTax: 340,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      transferAmount: input.transferAmount as number,
      availableExemption: input.availableExemption as number,
      gstRatePercent: input.gstRatePercent as number,
      otherTransferTax: input.otherTransferTax as number,
    }),
  description:
    "Calculate a caller-parameterized generation-skipping transfer tax layer.",
  id: "taxation/gst-layered-tax",
  inputs: [
    {
      id: "transferAmount",
      label: "Generation-skipping transfer",
      kind: "number",
      minimum: 0,
    },
    {
      id: "availableExemption",
      label: "Available exemption",
      kind: "number",
      minimum: 0,
    },
    {
      id: "gstRatePercent",
      label: "GST rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "otherTransferTax",
      label: "Other transfer tax",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "taxableGstTransfer",
      label: "Taxable GST transfer",
      kind: "number",
      minimum: 0,
    },
    { id: "gstTax", label: "GST tax", kind: "number", minimum: 0 },
    {
      id: "combinedTransferTax",
      label: "Combined transfer tax",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "GST Layered Tax",
});

export const run = tool.execute;
export default tool;
