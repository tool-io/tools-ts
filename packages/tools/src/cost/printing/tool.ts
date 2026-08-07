import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type PrintingCost = {
  readonly costPerCopy: number;
  readonly currency: string;
  readonly printedPages: number;
  readonly setupCost: number;
  readonly totalCost: number;
  readonly variableCost: number;
};
export const calculatePrintingCost = (
  pagesPerCopy: number,
  copies: number,
  inkPerPage: number,
  paperPerPage: number,
  setupCost: number,
  currency: string,
): PrintingCost | null => {
  if (!currency.trim() || copies <= 0) return null;
  const printedPages = pagesPerCopy * copies,
    variableCost = printedPages * (inkPerPage + paperPerPage),
    totalCost = variableCost + setupCost;
  return {
    costPerCopy: totalCost / copies,
    currency,
    printedPages,
    setupCost,
    totalCost,
    variableCost,
  };
};
export const printingCostExample = {
  input: {
    copies: 10,
    currency: "USD",
    inkPerPage: 0.08,
    pagesPerCopy: 20,
    paperPerPage: 0.02,
    setupCost: 5,
  },
  output: {
    result: {
      costPerCopy: 2.5,
      currency: "USD",
      printedPages: 200,
      setupCost: 5,
      totalCost: 25,
      variableCost: 20,
    },
  },
} satisfies ToolExample<
  {
    readonly copies: number;
    readonly currency: string;
    readonly inkPerPage: number;
    readonly pagesPerCopy: number;
    readonly paperPerPage: number;
    readonly setupCost: number;
  },
  { readonly result: PrintingCost }
>;
export const printingCostTool = createSimpleTool({
  id: "cost/printing",
  title: "Printing Cost Calculator",
  description:
    "Estimate ink, paper, setup, total, and per-copy printing costs.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    {
      id: "pagesPerCopy",
      kind: "integer",
      label: "Pages per copy",
      minimum: 0,
    },
    { id: "copies", kind: "integer", label: "Copies", minimum: 1 },
    {
      id: "inkPerPage",
      kind: "number",
      label: "Ink cost per page",
      minimum: 0,
    },
    {
      id: "paperPerPage",
      kind: "number",
      label: "Paper cost per page",
      minimum: 0,
    },
    { id: "setupCost", kind: "number", label: "Setup cost", minimum: 0 },
  ],
  outputs: [
    {
      format: "cost/printing",
      id: "result",
      kind: "object",
      label: "Printing cost",
    },
  ],
  calculate: (input) => {
    const result = calculatePrintingCost(
      input.pagesPerCopy as number,
      input.copies as number,
      input.inkPerPage as number,
      input.paperPerPage as number,
      input.setupCost as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "copies",
        "Copies must be positive and currency nonempty.",
      );
    return { result };
  },
});
export const runPrintingCost = printingCostTool.execute;
export default printingCostTool;
