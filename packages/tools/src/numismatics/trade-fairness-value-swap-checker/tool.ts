import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TradeFairnessValueSwapCheckerInput = Readonly<{
  readonly valueReceived: number;
  readonly valueGiven: number;
}>;
export type TradeFairnessValueSwapCheckerOutput = Readonly<{
  readonly netValueDifference: number;
}>;

export const calculateTradeFairnessValueSwapChecker = (
  x: TradeFairnessValueSwapCheckerInput,
): TradeFairnessValueSwapCheckerOutput => {
  if (!Number.isFinite(x.valueReceived) || x.valueReceived < 0)
    simpleError("valueReceived", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.valueGiven) || x.valueGiven < 0)
    simpleError("valueGiven", "Provide a finite nonnegative number.");
  const netValueDifference = x.valueReceived - x.valueGiven;
  if (!Number.isFinite(netValueDifference))
    simpleError(
      "netValueDifference",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    netValueDifference: Object.is(netValueDifference, -0)
      ? 0
      : netValueDifference,
  };
};

export const example = {
  input: {
    valueReceived: 110,
    valueGiven: 100,
  },
  output: { netValueDifference: 10 },
} satisfies ToolExample<
  TradeFairnessValueSwapCheckerInput,
  TradeFairnessValueSwapCheckerOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/trade-fairness-value-swap-checker",
  title: "Trade Fairness Value Swap Checker",
  description:
    "Show the nominal value gained or given up in a coin swap, before fees and condition differences.",
  inputs: [
    {
      id: "valueReceived",
      kind: "number",
      label: "Value Received",
      unit: "currency",
    },
    {
      id: "valueGiven",
      kind: "number",
      label: "Value Given",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "netValueDifference",
      kind: "number",
      label: "Net Value Difference",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateTradeFairnessValueSwapChecker({
      valueReceived: input.valueReceived as number,
      valueGiven: input.valueGiven as number,
    }),
});
export const runTradeFairnessValueSwapChecker = tool.execute;
export default tool;
