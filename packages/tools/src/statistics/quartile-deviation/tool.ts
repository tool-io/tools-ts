import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateInclusiveQuartiles } from "../inclusive-quartiles/tool.js";

export const calculateQuartileDeviation = (
  values: readonly number[],
): number | null => {
  const quartiles = calculateInclusiveQuartiles(values);
  if (quartiles === null) return null;
  const result = (quartiles[2] - quartiles[0]) / 2;
  return Number.isFinite(result) ? result : null;
};

export type QuartileDeviationInput = {
  readonly values: readonly number[];
};

export type QuartileDeviationOutput = {
  readonly quartileDeviation: number;
};

export const quartileDeviationExample = {
  input: { values: [1, 2, 3, 4, 5, 6, 7, 8] },
  output: { quartileDeviation: 2 },
} satisfies ToolExample<QuartileDeviationInput, QuartileDeviationOutput>;

export const quartileDeviationTool = createSimpleTool({
  id: "statistics/quartile-deviation",
  title: "Quartile Deviation Calculator",
  description:
    "Calculate the semi-interquartile range, half the distance between the inclusive third and first quartiles.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "quartile-deviation",
      id: "quartileDeviation",
      kind: "number",
      label: "Quartile deviation",
    },
  ],
  calculate: (input) => {
    const quartileDeviation = calculateQuartileDeviation(
      input.values as number[],
    );
    if (quartileDeviation === null)
      simpleError(
        "values",
        "Enter at least one finite number.",
        "empty_values",
      );
    return { quartileDeviation };
  },
});

export const runQuartileDeviation = quartileDeviationTool.execute;
export default quartileDeviationTool;
