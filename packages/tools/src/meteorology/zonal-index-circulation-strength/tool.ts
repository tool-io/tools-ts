import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerMatchedEastwardRingWindsMS: readonly number[];
  readonly callerRingArcWeights: readonly number[];
}>;
export type Output = Readonly<{ readonly weightedSignedZonalIndexMS: number }>;
const inputFields = [
  {
    id: "callerMatchedEastwardRingWindsMS",
    label: "Caller matched eastward ring winds m s",
    kind: "numberList",
  },
  {
    id: "callerRingArcWeights",
    label: "Caller ring arc weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRingArcWeights.forEach((v) =>
    nonnegative(v, "callerRingArcWeights"),
  );
  aligned(
    input.callerMatchedEastwardRingWindsMS,
    input.callerRingArcWeights,
    "callerMatchedEastwardRingWindsMS",
  );
  const w = weights(input.callerRingArcWeights);
  return {
    weightedSignedZonalIndexMS: sum(
      input.callerMatchedEastwardRingWindsMS.map((v, i) => v * w[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedEastwardRingWindsMS: [10, -5, 5],
  callerRingArcWeights: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  weightedSignedZonalIndexMS: 1.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/zonal-index-circulation-strength",
  title: "Zonal Index Circulation Strength Calculator",
  description:
    "Observed caller same-level/latitude zonal flow ring average with independent arc weights and explicit east-positive wind convention; not meridional pressure difference or blocking forecast. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "weightedSignedZonalIndexMS",
      label: "Weighted signed zonal index m s",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedEastwardRingWindsMS:
        value.callerMatchedEastwardRingWindsMS as readonly number[],
      callerRingArcWeights: value.callerRingArcWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
