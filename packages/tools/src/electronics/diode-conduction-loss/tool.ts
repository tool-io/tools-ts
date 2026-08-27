import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiodeConductionLossInput = {
  readonly averageCurrentA: number;
  readonly forwardVolts: number;
};

export type DiodeConductionLossOutput = {
  readonly conductionLossWatts: number;
};

export const diodeConductionLossExample = {
  input: { averageCurrentA: 1, forwardVolts: 0.7 },
  output: { conductionLossWatts: 0.7 },
} satisfies ToolExample<DiodeConductionLossInput, DiodeConductionLossOutput>;

export const diodeConductionLossTool = createSimpleTool({
  calculate: (input) => {
    const forwardVolts = input.forwardVolts as number;
    const averageCurrentA = input.averageCurrentA as number;
    if (!(forwardVolts > 0))
      simpleError(
        "forwardVolts",
        "Forward voltage must be positive.",
        "invalid_voltage",
      );
    if (!(averageCurrentA > 0))
      simpleError(
        "averageCurrentA",
        "Average current must be positive.",
        "invalid_current",
      );
    return {
      conductionLossWatts: forwardVolts * averageCurrentA,
    };
  },
  description:
    "Compute diode conduction loss as forward voltage times average forward current.",
  id: "electronics/diode-conduction-loss",
  inputs: [
    { id: "forwardVolts", kind: "number", label: "Forward voltage", unit: "V" },
    {
      id: "averageCurrentA",
      kind: "number",
      label: "Average current",
      unit: "A",
    },
  ],
  outputs: [
    {
      id: "conductionLossWatts",
      kind: "number",
      label: "Conduction loss",
      unit: "W",
    },
  ],
  title: "Diode Conduction Loss",
});
export const runDiodeConductionLoss = diodeConductionLossTool.execute;
export default diodeConductionLossTool;
