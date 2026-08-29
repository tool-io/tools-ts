import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    purchasePrice: 1200,
    downPayment: 0,
    profitMarkupPercent: 0,
    termMonths: 12,
  },
  output: { financedAmount: 1200, totalRepayment: 1200, monthlyPayment: 100 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "mortgage/morocco-murabaha",
  title: "Morocco Murabaha Home-Financing Calculator",
  description:
    "Model a disclosed, one-time Murabaha sale-price markup on the financed purchase amount and equal monthly repayments. This is not an interest-rate conversion or a determination of contract or Sharia compliance.",
  inputs: [
    {
      id: "purchasePrice",
      kind: "number",
      label: "Purchase price",
      minimum: Number.MIN_VALUE,
    },
    { id: "downPayment", kind: "number", label: "Down payment", minimum: 0 },
    {
      id: "profitMarkupPercent",
      kind: "number",
      label: "One-time profit markup",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 1 },
  ],
  outputs: [
    { id: "financedAmount", kind: "number", label: "Financed amount" },
    { id: "totalRepayment", kind: "number", label: "Total repayment" },
    { id: "monthlyPayment", kind: "number", label: "Monthly payment" },
  ],
  calculate: (input) => {
    const financedAmount =
      (input.purchasePrice as number) - (input.downPayment as number);
    if (!(financedAmount > 0))
      simpleError(
        "downPayment",
        "Down payment must be less than purchase price.",
      );
    const totalRepayment =
      financedAmount * (1 + (input.profitMarkupPercent as number) / 100);
    const monthlyPayment = totalRepayment / (input.termMonths as number);
    if (!Number.isFinite(monthlyPayment))
      simpleError("purchasePrice", "Result overflows.");
    return { financedAmount, totalRepayment, monthlyPayment };
  },
});
export type MoroccoMurabahaInput = Readonly<typeof example.input>;
export type MoroccoMurabahaOutput = Readonly<typeof example.output>;
export const moroccoMurabahaTool = tool;
export const runMoroccoMurabaha = tool.execute;
export default tool;
