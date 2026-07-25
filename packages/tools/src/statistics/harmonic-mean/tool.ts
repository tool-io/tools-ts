import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HarmonicMeanInput = { readonly values: readonly number[] };
export type HarmonicMeanOutput = { readonly harmonicMean: number };

export const harmonicMeanExample = {
  input: { values: [1, 2, 4] },
  output: { harmonicMean: 12 / 7 },
} satisfies ToolExample<HarmonicMeanInput, HarmonicMeanOutput>;

export const harmonicMeanTool = createSimpleTool({
  id: "statistics/harmonic-mean",
  title: "Harmonic Mean Calculator",
  description:
    "Calculate the harmonic mean of a nonempty list of positive numbers.",
  inputs: [
    {
      description: "Positive finite values, such as rates or ratios.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
  ],
  outputs: [
    {
      format: "harmonic-mean",
      id: "harmonicMean",
      kind: "number",
      label: "Harmonic mean",
    },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    if (values.some((value) => value <= 0))
      simpleError("values", "Harmonic mean requires positive values.");
    return {
      harmonicMean:
        values.length / values.reduce((sum, value) => sum + 1 / value, 0),
    };
  },
});

export const runHarmonicMean = harmonicMeanTool.execute;
export default harmonicMeanTool;
