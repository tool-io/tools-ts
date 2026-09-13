import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  fraction,
  sum,
  aligned,
  shape,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualInitialCohortCounts: readonly number[];
  readonly callerEstablishedNextPeriodTransitionMatrix: readonly (readonly number[])[];
  readonly callerIndependentPeriodAdditions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialCohortCounts",
    label: "Actual initial cohort counts",
    kind: "numberList",
  },
  {
    id: "callerEstablishedNextPeriodTransitionMatrix",
    label: "Caller established next period transition matrix",
    kind: "matrix",
  },
  {
    id: "callerIndependentPeriodAdditions",
    label: "Caller independent period additions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = input.actualInitialCohortCounts.length;
  if (
    !n ||
    n > 64 ||
    shape(input.callerEstablishedNextPeriodTransitionMatrix, "matrix") !== n ||
    input.callerEstablishedNextPeriodTransitionMatrix.length !== n
  )
    simpleError("matrix", "Actualsquarematchedcohorts≤64.");
  aligned(
    input.actualInitialCohortCounts,
    input.callerIndependentPeriodAdditions,
    "cohorts",
  );
  input.actualInitialCohortCounts.forEach((v) => nonnegative(v, "population"));
  input.callerEstablishedNextPeriodTransitionMatrix
    .flat()
    .forEach((v) => fraction(v, "transition"));
  for (let j = 0; j < n; j++)
    if (
      sum(input.callerEstablishedNextPeriodTransitionMatrix.map((r) => r[j])) >
      1 + 1e-9
    )
      simpleError("matrix", "Survival/agingcolumns≤1,additionsseparate.");
  const a = input.callerEstablishedNextPeriodTransitionMatrix.map(
    (r, i) =>
      sum(r.map((v, j) => v * input.actualInitialCohortCounts[j])) +
      input.callerIndependentPeriodAdditions[i],
  );
  if (a.some((v) => v < 0))
    simpleError("counts", "Conditionalnonnegativepopulations.");
  return { conditionalNextPeriodCohortCounts: a };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInitialCohortCounts: [10, 20],
    callerEstablishedNextPeriodTransitionMatrix: [
      [0.5, 0],
      [0.5, 1],
    ],
    callerIndependentPeriodAdditions: [1, 2],
  },
  output: { result: { conditionalNextPeriodCohortCounts: [6, 27] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/cohort-component-projection",
  title: "Cohort Component Projection Calculator",
  description:
    "One externally established cohort survival/aging transition plus independent births/net migration additions, population vector next=Tnow+additions. Not fit demographic rates or validated multi-year forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
