import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BjtBaseCurrentInput = {
  readonly betaHfe: number;
  readonly collectorCurrentA: number;
};

export type BjtBaseCurrentOutput = {
  readonly baseCurrentA: number;
};

export const bjtBaseCurrentExample = {
  input: { betaHfe: 100, collectorCurrentA: 0.01 },
  output: { baseCurrentA: 0.0001 },
} satisfies ToolExample<BjtBaseCurrentInput, BjtBaseCurrentOutput>;

export const calculateBjtBaseCurrent = (
  input: BjtBaseCurrentInput,
): BjtBaseCurrentOutput => {
  if (!(input.collectorCurrentA > 0))
    simpleError(
      "collectorCurrentA",
      "Collector current must be positive.",
      "invalid_collector_current",
    );
  if (!(input.betaHfe > 0))
    simpleError("betaHfe", "Beta must be positive.", "invalid_beta");
  return { baseCurrentA: input.collectorCurrentA / input.betaHfe };
};

export const bjtBaseCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateBjtBaseCurrent(input as unknown as BjtBaseCurrentInput),
  description: "Calculate BJT base current.",
  id: "electronics/bjt-base-current",
  inputs: [
    {
      id: "collectorCurrentA",
      kind: "number",
      label: "Collector current",
      unit: "A",
    },
    { id: "betaHfe", kind: "number", label: "DC current gain" },
  ],
  outputs: [
    { id: "baseCurrentA", kind: "number", label: "Base current", unit: "A" },
  ],
  title: "BJT Base Current",
});
export const runBjtBaseCurrent = bjtBaseCurrentTool.execute;
export default bjtBaseCurrentTool;
