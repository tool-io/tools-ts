import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { sampleStandardDeviation: 0.5, mean: 10 },
  output: { rsdPercent: 5 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "chemistry/analytical-relative-standard-deviation",
  title: "Analytical Relative Standard Deviation",
  description:
    "Calculate relative standard deviation from a supplied sample standard deviation and mean: RSD%=100s/|mean|. The mean cannot be zero; this is a precision measure, not an accuracy estimate.",
  inputs: [
    {
      id: "sampleStandardDeviation",
      kind: "number",
      label: "Sample standard deviation",
      minimum: 0,
    },
    { id: "mean", kind: "number", label: "Sample mean" },
  ],
  outputs: [{ id: "rsdPercent", kind: "number", label: "Rsd Percent" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.mean === 0)
      simpleError(
        "mean",
        "Mean must be nonzero for relative standard deviation.",
      );
    const output = {
      rsdPercent: (100 * i.sampleStandardDeviation) / Math.abs(i.mean),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type AnalyticalRelativeStandardDeviationInput = Readonly<
  typeof example.input
>;
export type AnalyticalRelativeStandardDeviationOutput = Readonly<
  typeof example.output
>;
export const analyticalRelativeStandardDeviationTool = tool;
export const runAnalyticalRelativeStandardDeviation = tool.execute;
export default tool;
