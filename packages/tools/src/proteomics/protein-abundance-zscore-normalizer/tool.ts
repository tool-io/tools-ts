import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
  mean,
  sampleVariance,
} from "../batch53-shared.js";

export type Input = Readonly<{ intensities: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intensities", label: "Intensities", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  if (i.intensities.length < 2)
    simpleError("intensities", "At least two observations.");
  i.intensities.forEach((v) => nonnegative(v, "intensity"));
  const m = mean(i.intensities),
    sd = positive(Math.sqrt(sampleVariance(i.intensities)), "sample-sd");
  return {
    mean: m,
    sampleStandardDeviation: sd,
    zScores: i.intensities.map((v) => (v - m) / sd),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { intensities: [1, 2, 3] },
  output: {
    result: { mean: 2, sampleStandardDeviation: 1, zScores: [-1, 0, 1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-abundance-zscore-normalizer",
  title: "Protein Abundance Z-Score Row Normalizer",
  description:
    "Normalize a supplied protein abundance row with sample standard deviation (n−1); constant rows are undefined rather than fabricated zeros.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mean: { type: "number" },
          sampleStandardDeviation: { type: "number" },
          zScores: { type: "array", items: { type: "number" } },
        },
        required: ["mean", "sampleStandardDeviation", "zScores"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
