import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    purchasePrice: 1200,
    customerDownPayment: 0,
    annualRentRatePercent: 0,
    termMonths: 12,
  },
  output: {
    bankShare: 1200,
    monthlyEquityPurchase: 100,
    firstMonthlyPayment: 100,
    finalMonthlyPayment: 100,
    totalRent: 0,
    totalPaid: 1200,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "mortgage/pakistan-diminishing-musharakah",
  title: "Pakistan Diminishing Musharakah Calculator",
  description:
    "Project equal monthly purchases of a bank's ownership share plus rent on its remaining share. Rent decreases as the customer's share rises; actual contract terms and eligibility are not inferred.",
  inputs: [
    {
      id: "purchasePrice",
      kind: "number",
      label: "Purchase price",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "customerDownPayment",
      kind: "number",
      label: "Customer down payment",
      minimum: 0,
    },
    {
      id: "annualRentRatePercent",
      kind: "number",
      label: "Annual rent rate on remaining bank share",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 1 },
  ],
  outputs: [
    { id: "bankShare", kind: "number", label: "Starting bank share" },
    {
      id: "monthlyEquityPurchase",
      kind: "number",
      label: "Monthly share purchase",
    },
    {
      id: "firstMonthlyPayment",
      kind: "number",
      label: "First monthly payment",
    },
    {
      id: "finalMonthlyPayment",
      kind: "number",
      label: "Final monthly payment",
    },
    { id: "totalRent", kind: "number", label: "Total rent" },
    { id: "totalPaid", kind: "number", label: "Total paid after down payment" },
  ],
  calculate: (input) => {
    const bankShare =
      (input.purchasePrice as number) - (input.customerDownPayment as number);
    if (!(bankShare > 0))
      simpleError(
        "customerDownPayment",
        "Down payment must be less than purchase price.",
      );
    const months = input.termMonths as number,
      rate = (input.annualRentRatePercent as number) / 1200;
    const monthlyEquityPurchase = bankShare / months;
    const firstMonthlyPayment = monthlyEquityPurchase + bankShare * rate;
    const finalMonthlyPayment =
      monthlyEquityPurchase + monthlyEquityPurchase * rate;
    const totalRent = (bankShare * rate * (months + 1)) / 2;
    const totalPaid = bankShare + totalRent;
    if (
      ![firstMonthlyPayment, finalMonthlyPayment, totalRent, totalPaid].every(
        Number.isFinite,
      )
    )
      simpleError("purchasePrice", "Result overflows.");
    return {
      bankShare,
      monthlyEquityPurchase,
      firstMonthlyPayment,
      finalMonthlyPayment,
      totalRent,
      totalPaid,
    };
  },
});
export type PakistanDiminishingMusharakahInput = Readonly<typeof example.input>;
export type PakistanDiminishingMusharakahOutput = Readonly<
  typeof example.output
>;
export const pakistanDiminishingMusharakahTool = tool;
export const runPakistanDiminishingMusharakah = tool.execute;
export default tool;
