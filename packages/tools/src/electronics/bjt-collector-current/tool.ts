import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BjtCollectorCurrentInput = {
  readonly baseCurrentA: number;
  readonly betaHfe: number;
};

export type BjtCollectorCurrentOutput = {
  readonly collectorCurrentA: number;
};

export const bjtCollectorCurrentExample = {
  input: { baseCurrentA: 0.00001, betaHfe: 100 },
  output: { collectorCurrentA: 0.001 },
} satisfies ToolExample<BjtCollectorCurrentInput, BjtCollectorCurrentOutput>;

export const calculateBjtCollectorCurrent = (
  input: BjtCollectorCurrentInput,
): BjtCollectorCurrentOutput => {
  if (!(input.betaHfe > 0))
    simpleError("betaHfe", "Beta must be positive.", "invalid_beta");
  return { collectorCurrentA: input.betaHfe * input.baseCurrentA };
};

export const bjtCollectorCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateBjtCollectorCurrent(input as unknown as BjtCollectorCurrentInput),
  description: "Calculate BJT collector current.",
  id: "electronics/bjt-collector-current",
  inputs: [
    { id: "baseCurrentA", kind: "number", label: "Base current", unit: "A" },
    { id: "betaHfe", kind: "number", label: "DC current gain" },
  ],
  outputs: [
    {
      id: "collectorCurrentA",
      kind: "number",
      label: "Collector current",
      unit: "A",
    },
  ],
  title: "BJT Collector Current",
});
export const runBjtCollectorCurrent = bjtCollectorCurrentTool.execute;
export default bjtCollectorCurrentTool;
