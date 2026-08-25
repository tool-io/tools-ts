import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const pinningCo2ThresholdTriggerCheckerExample = {
  input: { currentCo2Ppm: 800 },
  output: { atOrBelowThreshold: true, currentCo2Ppm: 800 },
} satisfies ToolExample<
  {
    readonly currentCo2Ppm: number;
    readonly pinningThresholdPpm?: number;
  },
  {
    readonly atOrBelowThreshold: boolean;
    readonly currentCo2Ppm: number;
  }
>;

export const pinningCo2ThresholdTriggerCheckerTool = createSimpleTool({
  id: "mycology/pinning-co2-threshold-trigger-checker",
  title: "CO2 Pinning Trigger",
  description:
    "Check whether measured carbon dioxide is at or below a caller-selected fruiting threshold; CO₂ alone does not determine whether pinning should begin.",
  inputs: [
    {
      id: "currentCo2Ppm",
      label: "Current CO2",
      kind: "number",
      minimum: 0,
      unit: "ppm",
    },
    {
      default: 1000,
      id: "pinningThresholdPpm",
      label: "Pinning threshold CO2",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "ppm",
    },
  ],
  outputs: [
    {
      id: "atOrBelowThreshold",
      label: "At or below threshold",
      kind: "boolean",
    },
    { id: "currentCo2Ppm", label: "Current CO2", kind: "number", unit: "ppm" },
  ],
  calculate: (input) => ({
    currentCo2Ppm: input.currentCo2Ppm as number,
    atOrBelowThreshold:
      (input.currentCo2Ppm as number) <= (input.pinningThresholdPpm as number),
  }),
});
export const runPinningCo2ThresholdTriggerChecker =
  pinningCo2ThresholdTriggerCheckerTool.execute;
export default pinningCo2ThresholdTriggerCheckerTool;
