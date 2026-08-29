import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { monthlyPayment } from "../financial-models.js";

export const example = {
  input: {
    principalUI: 1200,
    annualRatePercent: 0,
    termMonths: 12,
    uiValueToday: 1,
    annualUiGrowthPercent: 0,
  },
  output: {
    monthlyPaymentUI: 100,
    firstPaymentCurrency: 100,
    finalPaymentCurrency: 100,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "mortgage/uruguay-ui-indexed",
  title: "Uruguay UI-Indexed Mortgage Projection",
  description:
    "Calculate a fixed amortizing payment in indexed units (UI) and convert its first and final months to currency using caller-supplied UI value and constant projected annual UI growth. Future indexation is a scenario, not a forecast.",
  inputs: [
    {
      id: "principalUI",
      kind: "number",
      label: "Principal in UI",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "annualRatePercent",
      kind: "number",
      label: "Annual rate",
      minimum: 0,
    },
    { id: "termMonths", kind: "integer", label: "Term in months", minimum: 1 },
    {
      id: "uiValueToday",
      kind: "number",
      label: "Currency per UI today",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "annualUiGrowthPercent",
      kind: "number",
      label: "Projected annual UI growth",
      minimum: -99.999,
    },
  ],
  outputs: [
    { id: "monthlyPaymentUI", kind: "number", label: "Payment in UI" },
    {
      id: "firstPaymentCurrency",
      kind: "number",
      label: "First payment in currency",
    },
    {
      id: "finalPaymentCurrency",
      kind: "number",
      label: "Final payment in currency",
    },
  ],
  calculate: (input) => {
    const monthlyPaymentUI = monthlyPayment(
      input.principalUI as number,
      input.annualRatePercent as number,
      input.termMonths as number,
    );
    const firstPaymentCurrency =
      monthlyPaymentUI * (input.uiValueToday as number);
    const finalPaymentCurrency =
      firstPaymentCurrency *
      (1 + (input.annualUiGrowthPercent as number) / 100) **
        (((input.termMonths as number) - 1) / 12);
    if (!Number.isFinite(finalPaymentCurrency))
      simpleError("annualUiGrowthPercent", "Projection overflows.");
    return { monthlyPaymentUI, firstPaymentCurrency, finalPaymentCurrency };
  },
});
export type UruguayUiIndexedInput = Readonly<typeof example.input>;
export type UruguayUiIndexedOutput = Readonly<typeof example.output>;
export const uruguayUiIndexedTool = tool;
export const runUruguayUiIndexed = tool.execute;
export default tool;
