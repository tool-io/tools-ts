import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedEffectiveSeismicWeightsN: readonly number[];
  readonly callerMatchedBaseShearCoefficient: number;
  readonly callerHeightDistributionWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerModeledBaseShearN: number;
  readonly lateralForcesByLevelN: readonly number[];
}>;
const inputFields = [
  {
    id: "callerVerifiedEffectiveSeismicWeightsN",
    label: "Caller verified effective seismic weights n",
    kind: "numberList",
  },
  {
    id: "callerMatchedBaseShearCoefficient",
    label: "Caller matched base shear coefficient",
    kind: "number",
  },
  {
    id: "callerHeightDistributionWeights",
    label: "Caller height distribution weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedEffectiveSeismicWeightsN.forEach((v) =>
    nonnegative(v, "callerVerifiedEffectiveSeismicWeightsN"),
  );
  input.callerHeightDistributionWeights.forEach((v) =>
    nonnegative(v, "callerHeightDistributionWeights"),
  );
  nonnegative(
    input.callerMatchedBaseShearCoefficient,
    "callerMatchedBaseShearCoefficient",
  );
  aligned(
    input.callerVerifiedEffectiveSeismicWeightsN,
    input.callerHeightDistributionWeights,
    "callerVerifiedEffectiveSeismicWeightsN",
  );
  const shear =
      sum(input.callerVerifiedEffectiveSeismicWeightsN) *
      input.callerMatchedBaseShearCoefficient,
    w = weights(input.callerHeightDistributionWeights);
  return {
    callerModeledBaseShearN: shear,
    lateralForcesByLevelN: w.map((v) => v * shear),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedEffectiveSeismicWeightsN: [100, 200],
  callerMatchedBaseShearCoefficient: 0.1,
  callerHeightDistributionWeights: [1, 3],
} satisfies Input;
export const exampleOutput = {
  callerModeledBaseShearN: 30,
  lateralForcesByLevelN: [7.5, 22.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/earthquake-base-shear",
  title: "Earthquake Base Shear Calculator",
  description:
    "Sum caller independent effective seismic weights/coefficient and distribute with explicit level weights, not code spectrum or adequate structural design. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledBaseShearN",
      label: "Caller modeled base shear n",
      kind: "number",
    },
    {
      id: "lateralForcesByLevelN",
      label: "Lateral forces by level n",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedEffectiveSeismicWeightsN:
        value.callerVerifiedEffectiveSeismicWeightsN as readonly number[],
      callerMatchedBaseShearCoefficient:
        value.callerMatchedBaseShearCoefficient as number,
      callerHeightDistributionWeights:
        value.callerHeightDistributionWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
