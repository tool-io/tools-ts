import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const canBusTerminationResistanceExample = {
  input: { terminatorCount: 2 },
} satisfies ToolExample<{
  readonly terminatorCount: number;
}>;

export const canBusTerminationResistanceTool = createSimpleTool({
  id: "electronics/can-bus-termination-resistance",
  title: "CAN Termination Check",
  description:
    "Compute the effective CAN bus termination resistance from the number of 120 ohm terminators (one or two).",
  inputs: [
    {
      default: 2,
      description: "Number of 120 ohm terminators installed on the bus.",
      id: "terminatorCount",
      label: "Terminator count",
      kind: "integer",
      maximum: 2,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "effectiveTerminationOhms",
      label: "Effective termination resistance",
      kind: "number",
      unit: "\u03a9",
    },
  ],
  calculate: (input) => ({
    effectiveTerminationOhms: 120 / (input.terminatorCount as number),
  }),
});
export const runCanBusTerminationResistance =
  canBusTerminationResistanceTool.execute;
export default canBusTerminationResistanceTool;
