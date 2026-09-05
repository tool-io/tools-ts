import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerOrdinalMohsTestRank: number;
  readonly callerOrdinalSpecimenRank: number;
}>;
export type Output = Readonly<{
  readonly ordinalRankGap: number;
  readonly predictedQuantitativeAbrasionRatioAvailable: boolean;
}>;
const inputFields = [
  {
    id: "callerOrdinalMohsTestRank",
    label: "Caller ordinal mohs test rank",
    kind: "number",
  },
  {
    id: "callerOrdinalSpecimenRank",
    label: "Caller ordinal specimen rank",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerOrdinalMohsTestRank, "rank", 1, 10);
  bounded(input.callerOrdinalSpecimenRank, "rank", 1, 10);
  return {
    ordinalRankGap:
      input.callerOrdinalMohsTestRank - input.callerOrdinalSpecimenRank,
    predictedQuantitativeAbrasionRatioAvailable: false,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOrdinalMohsTestRank: 7,
  callerOrdinalSpecimenRank: 5,
} satisfies Input;
export const exampleOutput = {
  ordinalRankGap: 2,
  predictedQuantitativeAbrasionRatioAvailable: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/scratch-hardness-gap",
  title: "Scratch Hardness Gap Calculator",
  description:
    "Mohs ordinal rank gap only; gaps are not equal physical hardness units or universal scratch/abrasion ratio, independently established ranks required. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    { id: "ordinalRankGap", label: "Ordinal rank gap", kind: "number" },
    {
      id: "predictedQuantitativeAbrasionRatioAvailable",
      label: "Predicted quantitative abrasion ratio available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerOrdinalMohsTestRank: value.callerOrdinalMohsTestRank as number,
      callerOrdinalSpecimenRank: value.callerOrdinalSpecimenRank as number,
    }),
});
export const run = tool.execute;
export default tool;
