import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ExcessLossLayerCostInput = {
  readonly attachmentPoint: number;
  readonly layerLimit: number;
  readonly totalLosses: number;
};

export type ExcessLossLayerCostOutput = {
  readonly excessLayerCost: number;
};

export const excessLossLayerCostExample = {
  input: {
    attachmentPoint: 500000,
    layerLimit: 500000,
    totalLosses: 1200000,
  },
  output: {
    excessLayerCost: 500000,
  },
} satisfies ToolExample<ExcessLossLayerCostInput, ExcessLossLayerCostOutput>;

export const calculateExcessLossLayerCost = (
  input: ExcessLossLayerCostInput,
): ExcessLossLayerCostOutput => {
  const excess = Math.max(0, input.totalLosses - input.attachmentPoint);
  return {
    excessLayerCost: Math.min(excess, input.layerLimit),
  };
};

export const excessLossLayerCostTool = createSimpleTool({
  calculate: (input) =>
    calculateExcessLossLayerCost({
      attachmentPoint: input.attachmentPoint as number,
      layerLimit: input.layerLimit as number,
      totalLosses: input.totalLosses as number,
    }),
  description:
    "Calculate the aggregate loss falling within a layer above an attachment point, capped by the layer limit.",
  id: "actuarial/excess-loss-layer-cost",
  inputs: [
    {
      description: "Retention where the excess layer begins.",
      id: "attachmentPoint",
      kind: "number",
      label: "Attachment point",
      minimum: 0,
    },
    {
      description: "Height of the excess layer above the attachment point.",
      id: "layerLimit",
      kind: "number",
      label: "Layer limit",
      minimum: 0,
    },
    {
      description: "Total ground-up losses for the period.",
      id: "totalLosses",
      kind: "number",
      label: "Total losses",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Losses piercing the excess layer, capped at the limit.",
      id: "excessLayerCost",
      kind: "number",
      label: "Excess layer cost",
    },
  ],
  title: "Aggregate Excess Loss Layer Calculator",
});
export const runExcessLossLayerCost = excessLossLayerCostTool.execute;
export default excessLossLayerCostTool;
