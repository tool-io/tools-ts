import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrossDockFlowThroughRatePercentInput = {
  readonly flowThroughUnits: number;
  readonly totalUnitsReceived: number;
};

export type CrossDockFlowThroughRatePercentOutput = {
  readonly flowThroughPercent: number;
};

export const calculateCrossDockFlowThroughRatePercent = (
  input: CrossDockFlowThroughRatePercentInput,
): CrossDockFlowThroughRatePercentOutput => {
  if (
    !Number.isSafeInteger(input.totalUnitsReceived) ||
    input.totalUnitsReceived <= 0
  )
    return simpleError(
      "totalUnitsReceived",
      "Total units received must be a positive safe integer.",
      "invalid_units",
    );
  if (
    !Number.isSafeInteger(input.flowThroughUnits) ||
    input.flowThroughUnits < 0 ||
    input.flowThroughUnits > input.totalUnitsReceived
  )
    return simpleError(
      "flowThroughUnits",
      "Flow-through units must be a non-negative safe integer no greater than total units received.",
      "invalid_flow_through_units",
    );
  return {
    flowThroughPercent:
      (input.flowThroughUnits / input.totalUnitsReceived) * 100,
  };
};

export const crossDockFlowThroughRatePercentExample = {
  input: { flowThroughUnits: 3500, totalUnitsReceived: 5000 },
  output: { flowThroughPercent: 70 },
} satisfies ToolExample<
  CrossDockFlowThroughRatePercentInput,
  CrossDockFlowThroughRatePercentOutput
>;

export const crossDockFlowThroughRatePercentTool = createSimpleTool({
  id: "logistics/cross-dock-flow-through-rate-percent",
  title: "Cross Dock Flow Through Rate Percent Calculator",
  description:
    "Compute the share of received units that flow directly through the cross dock without storage.",
  inputs: [
    {
      description: "Units shipped without being put into storage.",
      id: "flowThroughUnits",
      kind: "integer",
      label: "Flow-through units",
      minimum: 0,
    },
    {
      description: "Total units received at the facility in the same period.",
      id: "totalUnitsReceived",
      kind: "integer",
      label: "Total received",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Flow-through units as a percent of units received.",
      id: "flowThroughPercent",
      kind: "number",
      label: "Flow-through",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateCrossDockFlowThroughRatePercent({
      flowThroughUnits: input.flowThroughUnits as number,
      totalUnitsReceived: input.totalUnitsReceived as number,
    }),
});

export const runCrossDockFlowThroughRatePercent =
  crossDockFlowThroughRatePercentTool.execute;
export default crossDockFlowThroughRatePercentTool;
