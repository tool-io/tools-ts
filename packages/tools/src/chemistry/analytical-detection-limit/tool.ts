import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { responseStandardDeviation: 0.02, calibrationSlope: 0.5 },
  output: { detectionLimit: 0.132 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/analytical-detection-limit",
  title: "Analytical Detection Limit",
  description:
    "Estimate a detection limit from response standard deviation and calibration slope using the stated 3.3σ/slope convention. This is one common calibration-based estimate, not a universal regulatory limit.",
  inputs: [
    {
      id: "responseStandardDeviation",
      kind: "number",
      label: "Response standard deviation",
      minimum: 0,
    },
    {
      id: "calibrationSlope",
      kind: "number",
      label: "Calibration slope",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "detectionLimit", kind: "number", label: "Detection Limit" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      detectionLimit: (3.3 * i.responseStandardDeviation) / i.calibrationSlope,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AnalyticalDetectionLimitInput = Readonly<typeof example.input>;
export type AnalyticalDetectionLimitOutput = Readonly<typeof example.output>;
export const analyticalDetectionLimitTool = tool;
export const runAnalyticalDetectionLimit = tool.execute;
export default tool;
