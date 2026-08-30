import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly biomarkerValues: readonly number[];
  readonly biomarkerWeights: readonly number[];
  readonly intercept: number;
  readonly decisionThreshold: number;
}>;
export type Output = Readonly<{
  readonly linearPredictor: number;
  readonly relativeRisk: number;
  readonly flagged: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.biomarkerValues.length === 0 ||
    input.biomarkerValues.length !== input.biomarkerWeights.length ||
    input.decisionThreshold <= 0
  )
    simpleError(
      "biomarkerValues",
      "Aligned biomarkers, weights and positive risk threshold are required.",
    );
  const linearPredictor = input.biomarkerValues.reduce(
      (sum, v, i) => sum + v * input.biomarkerWeights[i],
      input.intercept,
    ),
    relativeRisk = Math.exp(linearPredictor);
  return {
    linearPredictor,
    relativeRisk,
    flagged: relativeRisk >= input.decisionThreshold,
  };
};

export const exampleInput = {
  biomarkerValues: [2, 3],
  biomarkerWeights: [0.5, 1],
  intercept: -2,
  decisionThreshold: 0.7,
} satisfies Input;
export const exampleOutput = {
  linearPredictor: 2,
  relativeRisk: 7.38905609893065,
  flagged: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/grimage-risk-score",
  title: "GrimAge Risk Score",
  description:
    "Score a caller-calibrated methylation mortality-risk composite; no built-in clinical coefficients.",
  inputs: [
    { id: "biomarkerValues", kind: "numberList", label: "Biomarker values" },
    { id: "biomarkerWeights", kind: "numberList", label: "Biomarker weights" },
    { id: "intercept", kind: "number", label: "Intercept" },
    { id: "decisionThreshold", kind: "number", label: "Decision threshold" },
  ],
  outputs: [
    { id: "linearPredictor", kind: "number", label: "Linear predictor" },
    { id: "relativeRisk", kind: "number", label: "Relative risk" },
    { id: "flagged", kind: "boolean", label: "Flagged" },
  ],
  calculate: (value) =>
    calculate({
      biomarkerValues: value.biomarkerValues as readonly number[],
      biomarkerWeights: value.biomarkerWeights as readonly number[],
      intercept: value.intercept as number,
      decisionThreshold: value.decisionThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
