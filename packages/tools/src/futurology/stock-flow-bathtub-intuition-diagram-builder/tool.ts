import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StockFlowBathtubInput = {
  readonly initialStock: number;
  readonly inflowLabel: string;
  readonly netFlowPerPeriod: number;
  readonly outflowLabel: string;
  readonly periods: number;
  readonly stockLabel: string;
};

export type StockFlowBathtubOutput = {
  readonly diagram: string;
  readonly endingStock: number;
  readonly stockToNetFlowRatio: number;
};

export const buildStockFlowBathtubDiagram = (
  input: StockFlowBathtubInput,
): StockFlowBathtubOutput => {
  for (const [field, value] of [
    ["stockLabel", input.stockLabel],
    ["inflowLabel", input.inflowLabel],
    ["outflowLabel", input.outflowLabel],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Stock and flow labels must be nonempty strings.",
        "stock_flow_label_required",
      );
  if (!Number.isFinite(input.initialStock) || input.initialStock < 0)
    simpleError(
      "initialStock",
      "Initial stock must be finite and nonnegative.",
      "invalid_initial_stock",
    );
  if (!Number.isFinite(input.netFlowPerPeriod))
    simpleError(
      "netFlowPerPeriod",
      "Net flow must be finite.",
      "invalid_net_flow",
    );
  if (!Number.isSafeInteger(input.periods) || input.periods < 0)
    simpleError(
      "periods",
      "Periods must be a nonnegative integer.",
      "invalid_periods",
    );
  const endingStock =
    input.initialStock + input.netFlowPerPeriod * input.periods;
  if (!Number.isFinite(endingStock) || endingStock < 0)
    simpleError(
      "",
      "The ending stock must be finite and nonnegative.",
      "invalid_ending_stock",
    );
  const stockToNetFlowRatio =
    input.netFlowPerPeriod === 0
      ? 0
      : input.initialStock / Math.abs(input.netFlowPerPeriod);
  return {
    diagram: `[${input.stockLabel.trim()} = ${input.initialStock}] <- + ${input.inflowLabel.trim()} | - ${input.outflowLabel.trim()} -> ending stock = ${endingStock}`,
    endingStock,
    stockToNetFlowRatio,
  };
};

export const stockFlowBathtubExample = {
  input: {
    initialStock: 100,
    inflowLabel: "Deposits",
    netFlowPerPeriod: -5,
    outflowLabel: "Withdrawals",
    periods: 4,
    stockLabel: "Water",
  },
  output: {
    diagram: "[Water = 100] <- + Deposits | - Withdrawals -> ending stock = 80",
    endingStock: 80,
    stockToNetFlowRatio: 20,
  },
} satisfies ToolExample<StockFlowBathtubInput, StockFlowBathtubOutput>;

export const stockFlowBathtubTool = createSimpleTool({
  calculate: (input) =>
    buildStockFlowBathtubDiagram({
      initialStock: input.initialStock as number,
      inflowLabel: input.inflowLabel as string,
      netFlowPerPeriod: input.netFlowPerPeriod as number,
      outflowLabel: input.outflowLabel as string,
      periods: input.periods as number,
      stockLabel: input.stockLabel as string,
    }),
  description:
    "Build a labeled stock-flow bathtub diagram and calculate ending stock and stock-to-net-flow time intuition.",
  id: "futurology/stock-flow-bathtub-intuition-diagram-builder",
  inputs: [
    { id: "initialStock", kind: "number", label: "Initial stock", minimum: 0 },
    { id: "inflowLabel", kind: "string", label: "Inflow label" },
    { id: "netFlowPerPeriod", kind: "number", label: "Net flow per period" },
    { id: "outflowLabel", kind: "string", label: "Outflow label" },
    { id: "periods", kind: "integer", label: "Periods", minimum: 0 },
    { id: "stockLabel", kind: "string", label: "Stock label" },
  ],
  outputs: [
    { id: "diagram", kind: "string", label: "Stock-flow diagram" },
    { id: "endingStock", kind: "number", label: "Ending stock", minimum: 0 },
    {
      id: "stockToNetFlowRatio",
      kind: "number",
      label: "Stock-to-net-flow ratio",
      minimum: 0,
    },
  ],
  title: "Stock Flow Bathtub Intuition Diagram Builder",
});

export const runStockFlowBathtub = stockFlowBathtubTool.execute;
export default stockFlowBathtubTool;
