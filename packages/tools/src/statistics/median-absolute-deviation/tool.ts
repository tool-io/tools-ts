import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import type { ToolResult } from "../../core/result.js";
import {
  calculateMedianCenteredDeviation,
  medianCenteredDeviationInputSchema,
  medianCenteredDeviationOutputSchema,
  type MedianCenteredDeviationInput,
  type MedianCenteredDeviationOutput,
} from "../median-centered-deviation.js";
export type MedianAbsoluteDeviationInput = MedianCenteredDeviationInput;
export type MedianAbsoluteDeviationOutput = MedianCenteredDeviationOutput;
export const inputSchema = medianCenteredDeviationInputSchema;
export const outputSchema = medianCenteredDeviationOutputSchema;
export const calculateMedianAbsoluteDeviation = (
  input: unknown,
): ToolResult<MedianAbsoluteDeviationOutput> =>
  calculateMedianCenteredDeviation(input, "median");
export const medianAbsoluteDeviationExample = {
  input: { values: [2, 3, 3, 5, 100] },
  output: { count: 5, deviation: 1, median: 3 },
} satisfies ToolExample<
  MedianAbsoluteDeviationInput,
  MedianAbsoluteDeviationOutput
>;
export const medianAbsoluteDeviationTool = createModelDefinition<
  MedianAbsoluteDeviationInput,
  MedianAbsoluteDeviationOutput
>({
  id: "statistics/median-absolute-deviation",
  title: "Median Absolute Deviation Calculator",
  description:
    "Automatically find the sample median and the unscaled median of its absolute deviations, without a normal-consistency correction.",
  inputSchema,
  outputSchema,
  execute: calculateMedianAbsoluteDeviation,
});
export const runMedianAbsoluteDeviation = medianAbsoluteDeviationTool.execute;
export default medianAbsoluteDeviationTool;
