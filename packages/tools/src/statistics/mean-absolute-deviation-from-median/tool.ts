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
export type MeanAbsoluteDeviationFromMedianInput = MedianCenteredDeviationInput;
export type MeanAbsoluteDeviationFromMedianOutput =
  MedianCenteredDeviationOutput;
export const inputSchema = medianCenteredDeviationInputSchema;
export const outputSchema = medianCenteredDeviationOutputSchema;
export const calculateMeanAbsoluteDeviationFromMedian = (
  input: unknown,
): ToolResult<MeanAbsoluteDeviationFromMedianOutput> =>
  calculateMedianCenteredDeviation(input, "mean");
export const meanAbsoluteDeviationFromMedianExample = {
  input: { values: [2, 3, 3, 5, 100] },
  output: { count: 5, deviation: 20, median: 3 },
} satisfies ToolExample<
  MeanAbsoluteDeviationFromMedianInput,
  MeanAbsoluteDeviationFromMedianOutput
>;
export const meanAbsoluteDeviationFromMedianTool = createModelDefinition<
  MeanAbsoluteDeviationFromMedianInput,
  MeanAbsoluteDeviationFromMedianOutput
>({
  id: "statistics/mean-absolute-deviation-from-median",
  title: "Mean Absolute Deviation from the Median",
  description:
    "Automatically find the sample median and average its absolute deviations, without confusing this mean aggregation with the median absolute deviation statistic.",
  inputSchema,
  outputSchema,
  execute: calculateMeanAbsoluteDeviationFromMedian,
});
export const runMeanAbsoluteDeviationFromMedian =
  meanAbsoluteDeviationFromMedianTool.execute;
export default meanAbsoluteDeviationFromMedianTool;
