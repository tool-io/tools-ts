import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly measuredConcentration: number;
  readonly urineSpecificGravity: number;
  readonly referenceSpecificGravity: number;
  readonly baselineSpecificGravity: number;
}>;
export type Output = Readonly<{
  readonly dilutionCorrectionFactor: number;
  readonly correctedConcentration: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.urineSpecificGravity <= input.baselineSpecificGravity ||
    input.referenceSpecificGravity <= input.baselineSpecificGravity
  )
    simpleError(
      "urineSpecificGravity",
      "Specific gravities must exceed the chosen baseline.",
    );
  const dilutionCorrectionFactor =
    (input.referenceSpecificGravity - input.baselineSpecificGravity) /
    (input.urineSpecificGravity - input.baselineSpecificGravity);
  return {
    dilutionCorrectionFactor,
    correctedConcentration:
      input.measuredConcentration * dilutionCorrectionFactor,
  };
};
export const exampleInput = {
  measuredConcentration: 10,
  urineSpecificGravity: 1.01,
  referenceSpecificGravity: 1.02,
  baselineSpecificGravity: 1,
} satisfies Input;
export const exampleOutput = {
  dilutionCorrectionFactor: 2,
  correctedConcentration: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/urine-specific-gravity-correction",
  title: "Urine Specific Gravity Correction",
  description:
    "Correct urine concentration to a caller-selected specific-gravity reference.",
  inputs: [
    {
      id: "measuredConcentration",
      kind: "number",
      label: "Measured concentration",
    },
    {
      id: "urineSpecificGravity",
      kind: "number",
      label: "Urine specific gravity",
    },
    {
      id: "referenceSpecificGravity",
      kind: "number",
      label: "Reference specific gravity",
    },
    {
      id: "baselineSpecificGravity",
      kind: "number",
      label: "Baseline specific gravity",
    },
  ],
  outputs: [
    {
      id: "dilutionCorrectionFactor",
      kind: "number",
      label: "Dilution correction factor",
    },
    {
      id: "correctedConcentration",
      kind: "number",
      label: "Corrected concentration",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredConcentration: value.measuredConcentration as number,
      urineSpecificGravity: value.urineSpecificGravity as number,
      referenceSpecificGravity: value.referenceSpecificGravity as number,
      baselineSpecificGravity: value.baselineSpecificGravity as number,
    }),
});
export const run = tool.execute;
export default tool;
