import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrintCostTotalInput = Readonly<{
  readonly costPerPrint: number;
  readonly printCount: number;
}>;
export type PrintCostTotalOutput = Readonly<{
  readonly totalCost: number;
}>;

export const calculatePrintCostTotal = (
  x: PrintCostTotalInput,
): PrintCostTotalOutput => {
  if (!Number.isFinite(x.costPerPrint) || x.costPerPrint < 0)
    simpleError("costPerPrint", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.printCount) || x.printCount < 0)
    simpleError("printCount", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.printCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const totalCost = x.costPerPrint * x.printCount;
  if (!Number.isFinite(totalCost))
    simpleError(
      "totalCost",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalCost: Object.is(totalCost, -0) ? 0 : totalCost };
};

export const example = {
  input: { costPerPrint: 1000, printCount: 10 },
  output: { totalCost: 10000 },
} satisfies ToolExample<PrintCostTotalInput, PrintCostTotalOutput>;

export const tool = createSimpleTool({
  id: "film/print-cost-total",
  title: "Print Cost Total",
  description:
    "Total cost of physical release prints from a per-print price and print count; excludes shipping and taxes.",
  inputs: [
    {
      id: "costPerPrint",
      kind: "number",
      label: "Cost Per Print",
      unit: "currency/print",
      minimum: 0,
    },
    { id: "printCount", kind: "integer", label: "Print Count", minimum: 0 },
  ],
  outputs: [
    { id: "totalCost", kind: "number", label: "Total Cost", unit: "currency" },
  ],
  calculate: (input) =>
    calculatePrintCostTotal({
      costPerPrint: input.costPerPrint as number,
      printCount: input.printCount as number,
    }),
});
export const printCostTotalTool = tool;
export const runPrintCostTotal = tool.execute;
export default tool;
