import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly targetBandIntensity: number;
  readonly laneTotalProteinIntensity: number;
  readonly referenceLaneRatio: number;
}>;
export type Output = Readonly<{
  readonly targetToTotalRatio: number;
  readonly relativeExpression: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.targetBandIntensity < 0 ||
    input.laneTotalProteinIntensity <= 0 ||
    input.referenceLaneRatio <= 0
  )
    simpleError(
      "laneTotalProteinIntensity",
      "Positive lane total and reference ratio required.",
    );
  const targetToTotalRatio =
    input.targetBandIntensity / input.laneTotalProteinIntensity;
  return {
    targetToTotalRatio,
    relativeExpression: targetToTotalRatio / input.referenceLaneRatio,
  };
};
export const exampleInput = {
  targetBandIntensity: 80,
  laneTotalProteinIntensity: 200,
  referenceLaneRatio: 0.5,
} satisfies Input;
export const exampleOutput = {
  targetToTotalRatio: 0.4,
  relativeExpression: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/western-total-protein-normalization",
  title: "Western Total Protein Normalization",
  description:
    "Normalize a western target band to total-lane protein and a reference lane.",
  inputs: [
    {
      id: "targetBandIntensity",
      label: "Target band intensity",
      kind: "number",
    },
    {
      id: "laneTotalProteinIntensity",
      label: "Lane total protein intensity",
      kind: "number",
    },
    { id: "referenceLaneRatio", label: "Reference lane ratio", kind: "number" },
  ],
  outputs: [
    {
      id: "targetToTotalRatio",
      label: "Target to total ratio",
      kind: "number",
    },
    { id: "relativeExpression", label: "Relative expression", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      targetBandIntensity: value.targetBandIntensity as number,
      laneTotalProteinIntensity: value.laneTotalProteinIntensity as number,
      referenceLaneRatio: value.referenceLaneRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
