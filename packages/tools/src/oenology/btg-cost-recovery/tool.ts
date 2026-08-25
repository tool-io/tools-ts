import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BtgCostRecoveryInput = {
  readonly bottleCost: number;
  readonly glassPrice: number;
};

export type BtgCostRecoveryOutput = {
  readonly glassesToRecoverCost: number;
};

export const btgCostRecoveryExample = {
  input: {
    bottleCost: 18,
    glassPrice: 14,
  },
  output: {
    glassesToRecoverCost: 2,
  },
} satisfies ToolExample<BtgCostRecoveryInput, BtgCostRecoveryOutput>;

export const calculateBtgCostRecovery = (
  input: BtgCostRecoveryInput,
): BtgCostRecoveryOutput => {
  if (input.glassPrice <= 0)
    simpleError(
      "glassPrice",
      "The by-the-glass price must be positive.",
      "invalid_value",
    );
  return {
    glassesToRecoverCost: Math.ceil(input.bottleCost / input.glassPrice),
  };
};

export const btgCostRecoveryTool = createSimpleTool({
  calculate: (input) =>
    calculateBtgCostRecovery(input as unknown as BtgCostRecoveryInput),
  description:
    "Count the whole by-the-glass sales whose gross menu revenue reaches the bottle cost; this simple recovery point excludes tax, service, waste, and other variable costs.",
  id: "oenology/btg-cost-recovery",
  inputs: [
    {
      description: "Wholesale cost of the opened bottle.",
      id: "bottleCost",
      kind: "number",
      label: "Bottle cost",
      minimum: 0,
    },
    {
      description: "Menu price charged per glass pour.",
      id: "glassPrice",
      kind: "number",
      label: "Glass price",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Whole glass sales needed for gross revenue to reach bottle cost.",
      id: "glassesToRecoverCost",
      kind: "integer",
      label: "Glasses to recover",
    },
  ],
  title: "By-the-Glass Cost Recovery Calculator",
});
export const runBtgCostRecovery = btgCostRecoveryTool.execute;
export default btgCostRecoveryTool;
