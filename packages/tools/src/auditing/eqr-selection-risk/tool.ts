import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly engagementRiskScore: number;
  readonly publicInterestScore: number;
  readonly complexityScore: number;
  readonly inspectionRiskScore: number;
  readonly selectionThreshold: number;
}>;
export type Output = Readonly<{
  readonly weightedRiskScore: number;
  readonly thresholdMargin: number;
  readonly selected: boolean;
}>;

export const calculate = (input: Input): Output => {
  const weightedRiskScore =
    0.35 * input.engagementRiskScore +
    0.25 * input.publicInterestScore +
    0.25 * input.complexityScore +
    0.15 * input.inspectionRiskScore;
  return {
    weightedRiskScore,
    thresholdMargin: weightedRiskScore - input.selectionThreshold,
    selected: weightedRiskScore >= input.selectionThreshold,
  };
};

export const exampleInput = {
  engagementRiskScore: 80,
  publicInterestScore: 60,
  complexityScore: 70,
  inspectionRiskScore: 50,
  selectionThreshold: 65,
} satisfies Input;
export const exampleOutput = {
  weightedRiskScore: 68,
  thresholdMargin: 3,
  selected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      engagementRiskScore: input.engagementRiskScore as number,
      publicInterestScore: input.publicInterestScore as number,
      complexityScore: input.complexityScore as number,
      inspectionRiskScore: input.inspectionRiskScore as number,
      selectionThreshold: input.selectionThreshold as number,
    }),
  description: "Score engagement quality-review selection risk.",
  id: "auditing/eqr-selection-risk",
  inputs: [
    {
      id: "engagementRiskScore",
      label: "Engagement risk score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "publicInterestScore",
      label: "Public-interest score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "complexityScore",
      label: "Complexity score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "inspectionRiskScore",
      label: "Inspection risk score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "selectionThreshold",
      label: "Selection threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "weightedRiskScore",
      label: "Weighted selection score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "thresholdMargin",
      label: "Selection threshold margin",
      kind: "number",
    },
    {
      id: "selected",
      label: "Selected for engagement quality review",
      kind: "boolean",
    },
  ],
  title: "EQR Selection Risk",
});

export const run = tool.execute;
export default tool;
