import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrownOutThresholdCheckInput = Readonly<{
  readonly supplyVolts: number;
  readonly thresholdVolts: number;
}>;
export type BrownOutThresholdCheckOutput = Readonly<{
  readonly belowThreshold: boolean;
}>;

export const calculateBrownOutThresholdCheck = (
  x: BrownOutThresholdCheckInput,
): BrownOutThresholdCheckOutput => {
  if (!Number.isFinite(x.supplyVolts) || x.supplyVolts < 0)
    simpleError("supplyVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.thresholdVolts) || x.thresholdVolts < 0)
    simpleError("thresholdVolts", "Provide a finite number at least 0.");
  const belowThreshold = x.supplyVolts < x.thresholdVolts;
  if (typeof belowThreshold !== "boolean")
    simpleError("belowThreshold", "Inputs produce an invalid result.");
  return { belowThreshold: belowThreshold };
};

export const example = {
  input: { supplyVolts: 2.7, thresholdVolts: 3 },
  output: { belowThreshold: true },
} satisfies ToolExample<
  BrownOutThresholdCheckInput,
  BrownOutThresholdCheckOutput
>;

export const tool = createSimpleTool({
  id: "microcontroller/brown-out-threshold-check",
  title: "Brown Out Threshold Check",
  description:
    "Compare present supply voltage with a selected brown-out threshold; hysteresis and reset timing are device-specific.",
  inputs: [
    {
      id: "supplyVolts",
      kind: "number",
      label: "Supply Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "thresholdVolts",
      kind: "number",
      label: "Threshold Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "belowThreshold", kind: "boolean", label: "Below Threshold" },
  ],
  calculate: (input) =>
    calculateBrownOutThresholdCheck({
      supplyVolts: input.supplyVolts as number,
      thresholdVolts: input.thresholdVolts as number,
    }),
});
export const brownOutThresholdCheckTool = tool;
export const runBrownOutThresholdCheck = tool.execute;
export default tool;
