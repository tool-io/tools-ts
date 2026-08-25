import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FifoLayerRemainingQuantityTrackerInput = {
  readonly oldestLayerUnits: number;
  readonly totalUnitsShippedSinceLayerReceipt: number;
};

export type FifoLayerRemainingQuantityTrackerOutput = {
  readonly oldestLayerDepleted: boolean;
  readonly oldestLayerRemainingUnits: number;
  readonly unitsDrawnFromNewerLayers: number;
};

export const calculateFifoLayerRemainingQuantityTracker = (
  input: FifoLayerRemainingQuantityTrackerInput,
): FifoLayerRemainingQuantityTrackerOutput => {
  if (!(
    Number.isSafeInteger(input.oldestLayerUnits) && input.oldestLayerUnits > 0
  ))
    return simpleError(
      "oldestLayerUnits",
      "Oldest layer quantity must be greater than zero.",
      "invalid_layer",
    );
  if (!(
    Number.isSafeInteger(input.totalUnitsShippedSinceLayerReceipt) &&
    input.totalUnitsShippedSinceLayerReceipt >= 0
  ))
    return simpleError(
      "totalUnitsShippedSinceLayerReceipt",
      "Units shipped must be a non-negative whole number.",
      "invalid_shipments",
    );
  const shipped = input.totalUnitsShippedSinceLayerReceipt;
  return {
    oldestLayerRemainingUnits: Math.max(0, input.oldestLayerUnits - shipped),
    unitsDrawnFromNewerLayers: Math.max(0, shipped - input.oldestLayerUnits),
    oldestLayerDepleted: shipped >= input.oldestLayerUnits,
  };
};

export const fifoLayerRemainingQuantityTrackerExample = {
  input: { oldestLayerUnits: 400, totalUnitsShippedSinceLayerReceipt: 550 },
  output: {
    oldestLayerDepleted: true,
    oldestLayerRemainingUnits: 0,
    unitsDrawnFromNewerLayers: 150,
  },
} satisfies ToolExample<
  FifoLayerRemainingQuantityTrackerInput,
  FifoLayerRemainingQuantityTrackerOutput
>;

export const fifoLayerRemainingQuantityTrackerTool = createSimpleTool({
  id: "logistics/fifo-layer-remaining-quantity-tracker",
  title: "FIFO Layer Remaining Quantity Tracker",
  description:
    "Track FIFO consumption of the oldest inventory layer given shipments since it was received.",
  inputs: [
    {
      description: "Units in the oldest receipt layer.",
      id: "oldestLayerUnits",
      kind: "integer",
      label: "Oldest layer units",
      minimum: 1,
    },
    {
      description: "Total units shipped since that layer was received.",
      id: "totalUnitsShippedSinceLayerReceipt",
      kind: "integer",
      label: "Shipped since",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether the oldest layer has been fully consumed.",
      id: "oldestLayerDepleted",
      kind: "boolean",
      label: "Layer depleted",
    },
    {
      description: "Units still remaining in the oldest layer.",
      id: "oldestLayerRemainingUnits",
      kind: "integer",
      label: "Layer remaining",
      minimum: 0,
    },
    {
      description: "Units that had to come from newer layers.",
      id: "unitsDrawnFromNewerLayers",
      kind: "integer",
      label: "From newer layers",
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateFifoLayerRemainingQuantityTracker({
      oldestLayerUnits: input.oldestLayerUnits as number,
      totalUnitsShippedSinceLayerReceipt:
        input.totalUnitsShippedSinceLayerReceipt as number,
    }),
});

export const runFifoLayerRemainingQuantityTracker =
  fifoLayerRemainingQuantityTrackerTool.execute;
export default fifoLayerRemainingQuantityTrackerTool;
