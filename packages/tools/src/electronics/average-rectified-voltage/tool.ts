import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const averageRectifiedVoltageExample = {
  input: { peakVoltageV: 10 },
} satisfies ToolExample<{ readonly peakVoltageV: number }>;

export const averageRectifiedVoltageTool = createSimpleTool({
  id: "electronics/average-rectified-voltage",
  title: "Average Rectified Voltage",
  description:
    "Calculate the average rectified voltage of a sinusoid from its peak voltage.",
  inputs: [
    {
      id: "peakVoltageV",
      label: "Peak voltage",
      kind: "number",
      minimum: 0,
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "averageRectifiedVolts",
      label: "Average rectified voltage",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => ({
    averageRectifiedVolts: ((input.peakVoltageV as number) * 2) / Math.PI,
  }),
});
export const runAverageRectifiedVoltage = averageRectifiedVoltageTool.execute;
export default averageRectifiedVoltageTool;
