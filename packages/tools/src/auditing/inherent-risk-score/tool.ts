import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly complexityScore: number;
  readonly subjectivityScore: number;
  readonly changeScore: number;
  readonly fraudSusceptibilityScore: number;
  readonly riskThreshold: number;
}>;
export type Output = Readonly<{
  readonly weightedRiskScore: number;
  readonly thresholdMargin: number;
  readonly riskLevel: string;
}>;

export const calculate = (input: Input): Output => {
  const weightedRiskScore =
    0.25 * input.complexityScore +
    0.25 * input.subjectivityScore +
    0.2 * input.changeScore +
    0.3 * input.fraudSusceptibilityScore;
  return {
    weightedRiskScore,
    thresholdMargin: weightedRiskScore - input.riskThreshold,
    riskLevel:
      weightedRiskScore >= input.riskThreshold
        ? "high"
        : weightedRiskScore >= input.riskThreshold * 0.6
          ? "moderate"
          : "low",
  };
};

export const exampleInput = {
  complexityScore: 80,
  subjectivityScore: 60,
  changeScore: 50,
  fraudSusceptibilityScore: 70,
  riskThreshold: 65,
} satisfies Input;
export const exampleOutput = {
  weightedRiskScore: 66,
  thresholdMargin: 1,
  riskLevel: "high",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      complexityScore: input.complexityScore as number,
      subjectivityScore: input.subjectivityScore as number,
      changeScore: input.changeScore as number,
      fraudSusceptibilityScore: input.fraudSusceptibilityScore as number,
      riskThreshold: input.riskThreshold as number,
    }),
  description: "Combine inherent-risk factors into a weighted score.",
  id: "auditing/inherent-risk-score",
  inputs: [
    {
      id: "complexityScore",
      label: "Complexity score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "subjectivityScore",
      label: "Subjectivity score",
      kind: "number",
      minimum: 0,
    },
    { id: "changeScore", label: "Change score", kind: "number", minimum: 0 },
    {
      id: "fraudSusceptibilityScore",
      label: "Fraud susceptibility score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "riskThreshold",
      label: "High-risk threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "weightedRiskScore",
      label: "Weighted inherent-risk score",
      kind: "number",
      minimum: 0,
    },
    { id: "thresholdMargin", label: "Risk-threshold margin", kind: "number" },
    {
      id: "riskLevel",
      label: "Inherent risk level",
      kind: "string",
      enum: ["low", "moderate", "high"],
    },
  ],
  title: "Inherent Risk Score",
});

export const run = tool.execute;
export default tool;
