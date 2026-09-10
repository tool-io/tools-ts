import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  weightedTranslation,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCommonTranslationResidualsXyzMeters: readonly (readonly number[])[];
  readonly callerIndependentInverseVarianceWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCommonTranslationResidualsXyzMeters",
    label: "Actual common translation residuals xyz meters",
    kind: "matrix",
  },
  {
    id: "callerIndependentInverseVarianceWeights",
    label: "Caller independent inverse variance weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return weightedTranslation(
    input.actualCommonTranslationResidualsXyzMeters,
    input.callerIndependentInverseVarianceWeights,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCommonTranslationResidualsXyzMeters: [
      [1, 2, 3],
      [3, 4, 5],
    ],
    callerIndependentInverseVarianceWeights: [1, 1],
  },
  output: {
    result: {
      fittedTranslation: [2, 3, 4],
      postAdjustmentResiduals: [
        [-1, -1, -1],
        [1, 1, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/least-squares-adjustment-simple",
  title: "Least Squares Network Adjustment Simplified Solver",
  description:
    "Restricted weighted least-squares common3Dtranslation adjustment only, actual independently matched control-minus-survey residuals, positive total inversevariance. Not arbitrary network/rotation/scale adjustment, datum establishment or uncertainty estimation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
