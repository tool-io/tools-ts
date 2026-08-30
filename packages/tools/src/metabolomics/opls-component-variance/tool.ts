import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly predictiveVariance: number;
  readonly orthogonalVariance: number;
  readonly residualVariance: number;
}>;
export type Output = Readonly<{
  readonly explainedPercent: number;
  readonly predictiveShareOfExplainedPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    Math.min(
      input.predictiveVariance,
      input.orthogonalVariance,
      input.residualVariance,
    ) < 0
  )
    simpleError(
      "predictiveVariance",
      "Variance components must be nonnegative.",
    );
  const total =
      input.predictiveVariance +
      input.orthogonalVariance +
      input.residualVariance,
    explained = input.predictiveVariance + input.orthogonalVariance;
  if (total <= 0 || explained <= 0)
    simpleError(
      "predictiveVariance",
      "Total and explained variance must be positive.",
    );
  return {
    explainedPercent: (explained / total) * 100,
    predictiveShareOfExplainedPercent:
      (input.predictiveVariance / explained) * 100,
  };
};
export const exampleInput = {
  predictiveVariance: 30,
  orthogonalVariance: 20,
  residualVariance: 50,
} satisfies Input;
export const exampleOutput = {
  explainedPercent: 50,
  predictiveShareOfExplainedPercent: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/opls-component-variance",
  title: "OPLS Component Variance",
  description:
    "Partition caller-provided OPLS predictive and orthogonal variance.",
  inputs: [
    { id: "predictiveVariance", kind: "number", label: "Predictive variance" },
    { id: "orthogonalVariance", kind: "number", label: "Orthogonal variance" },
    { id: "residualVariance", kind: "number", label: "Residual variance" },
  ],
  outputs: [
    { id: "explainedPercent", kind: "number", label: "Explained percent" },
    {
      id: "predictiveShareOfExplainedPercent",
      kind: "number",
      label: "Predictive share of explained percent",
    },
  ],
  calculate: (value) =>
    calculate({
      predictiveVariance: value.predictiveVariance as number,
      orthogonalVariance: value.orthogonalVariance as number,
      residualVariance: value.residualVariance as number,
    }),
});
export const run = tool.execute;
export default tool;
