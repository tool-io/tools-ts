import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly targetEfficiency: number;
  readonly referenceEfficiency: number;
  readonly targetControlCt: number;
  readonly targetTreatmentCt: number;
  readonly referenceControlCt: number;
  readonly referenceTreatmentCt: number;
}>;
export type Output = Readonly<{
  readonly targetFold: number;
  readonly referenceFold: number;
  readonly expressionRatio: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.targetEfficiency <= 0 || input.referenceEfficiency <= 0)
    simpleError(
      "targetEfficiency",
      "Amplification efficiencies must be positive factors.",
    );
  const targetFold =
      input.targetEfficiency **
      (input.targetControlCt - input.targetTreatmentCt),
    referenceFold =
      input.referenceEfficiency **
      (input.referenceControlCt - input.referenceTreatmentCt);
  return {
    targetFold,
    referenceFold,
    expressionRatio: targetFold / referenceFold,
  };
};

export const exampleInput = {
  targetEfficiency: 2,
  referenceEfficiency: 2,
  targetControlCt: 25,
  targetTreatmentCt: 23,
  referenceControlCt: 20,
  referenceTreatmentCt: 20,
} satisfies Input;
export const exampleOutput = {
  targetFold: 4,
  referenceFold: 1,
  expressionRatio: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/pfaffl-expression-ratio",
  title: "Pfaffl Expression Ratio",
  description:
    "Calculate Pfaffl expression ratio with independent primer efficiencies.",
  inputs: [
    { id: "targetEfficiency", kind: "number", label: "Target efficiency" },
    {
      id: "referenceEfficiency",
      kind: "number",
      label: "Reference efficiency",
    },
    { id: "targetControlCt", kind: "number", label: "Target control ct" },
    { id: "targetTreatmentCt", kind: "number", label: "Target treatment ct" },
    {
      id: "referenceControlCt",
      kind: "number",
      label: "Reference control ct",
    },
    {
      id: "referenceTreatmentCt",
      kind: "number",
      label: "Reference treatment ct",
    },
  ],
  outputs: [
    { id: "targetFold", kind: "number", label: "Target fold" },
    { id: "referenceFold", kind: "number", label: "Reference fold" },
    { id: "expressionRatio", kind: "number", label: "Expression ratio" },
  ],
  calculate: (value) =>
    calculate({
      targetEfficiency: value.targetEfficiency as number,
      referenceEfficiency: value.referenceEfficiency as number,
      targetControlCt: value.targetControlCt as number,
      targetTreatmentCt: value.targetTreatmentCt as number,
      referenceControlCt: value.referenceControlCt as number,
      referenceTreatmentCt: value.referenceTreatmentCt as number,
    }),
});
export const run = tool.execute;
export default tool;
