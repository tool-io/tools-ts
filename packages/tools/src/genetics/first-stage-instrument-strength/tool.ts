import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, fraction, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly firstStageRSquared: number;
  readonly sampleSize: number;
  readonly instrumentCount: number;
  readonly minimumF: number;
}>;
export type Output = Readonly<{
  readonly fStatistic: number;
  readonly strongByThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  fraction(input.firstStageRSquared, "firstStageRSquared");
  count(input.sampleSize, "sampleSize", 3);
  count(input.instrumentCount, "instrumentCount", 1);
  nonnegative(input.minimumF, "minimumF");
  if (
    input.firstStageRSquared === 1 ||
    input.sampleSize <= input.instrumentCount + 1
  )
    simpleError(
      "sampleSize",
      "Positive residual degrees of freedom and R-squared below one required.",
    );
  const fStatistic =
    input.firstStageRSquared /
    input.instrumentCount /
    ((1 - input.firstStageRSquared) /
      (input.sampleSize - input.instrumentCount - 1));
  return { fStatistic, strongByThreshold: fStatistic >= input.minimumF };
};
export const exampleInput = {
  firstStageRSquared: 0.1,
  sampleSize: 100,
  instrumentCount: 2,
  minimumF: 10,
} satisfies Input;
export const exampleOutput = {
  fStatistic: 5.388888888888889,
  strongByThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/first-stage-instrument-strength",
  title: "First Stage Instrument Strength",
  description:
    "Compute the first-stage instrument-set F statistic from R-squared, sample size, and instrument count.",
  inputs: [
    {
      id: "firstStageRSquared",
      label: "First stage r squared",
      kind: "number",
    },
    { id: "sampleSize", label: "Sample size", kind: "integer" },
    { id: "instrumentCount", label: "Instrument count", kind: "integer" },
    { id: "minimumF", label: "Minimum f", kind: "number" },
  ],
  outputs: [
    { id: "fStatistic", label: "F statistic", kind: "number" },
    { id: "strongByThreshold", label: "Strong by threshold", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      firstStageRSquared: value.firstStageRSquared as number,
      sampleSize: value.sampleSize as number,
      instrumentCount: value.instrumentCount as number,
      minimumF: value.minimumF as number,
    }),
});
export const run = tool.execute;
export default tool;
