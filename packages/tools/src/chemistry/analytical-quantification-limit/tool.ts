import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { responseStandardDeviation: 0.02, calibrationSlope: 0.5 },
  output: { quantificationLimit: 0.4 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/analytical-quantification-limit",
  title: "Analytical Quantification Limit",
  description:
    "Estimate a quantification limit from response standard deviation and calibration slope using the stated 10σ/slope convention. Confirm the method-specific definition before reporting an official LOQ.",
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
  outputs: [
    {
      id: "quantificationLimit",
      kind: "number",
      label: "Quantification Limit",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      quantificationLimit:
        (10 * i.responseStandardDeviation) / i.calibrationSlope,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AnalyticalQuantificationLimitInput = Readonly<typeof example.input>;
export type AnalyticalQuantificationLimitOutput = Readonly<
  typeof example.output
>;
export const analyticalQuantificationLimitTool = tool;
export const runAnalyticalQuantificationLimit = tool.execute;
export default tool;
