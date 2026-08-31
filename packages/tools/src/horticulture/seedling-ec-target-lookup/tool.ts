import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerSeedlingStageIds: readonly string[];
  readonly callerFinalSolutionEcMinimum: readonly number[];
  readonly callerFinalSolutionEcMaximum: readonly number[];
  readonly querySeedlingStageId: string;
  readonly observedFinalSolutionEc: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerFinalSolutionEcRange: readonly number[];
  readonly solutionSamplesOutsideCallerEcIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSeedlingStageIds",
    label: "Caller seedling stage ids",
    kind: "stringList",
  },
  {
    id: "callerFinalSolutionEcMinimum",
    label: "Caller final solution ec minimum",
    kind: "numberList",
  },
  {
    id: "callerFinalSolutionEcMaximum",
    label: "Caller final solution ec maximum",
    kind: "numberList",
  },
  {
    id: "querySeedlingStageId",
    label: "Query seedling stage id",
    kind: "string",
  },
  {
    id: "observedFinalSolutionEc",
    label: "Observed final solution ec",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerFinalSolutionEcMinimum.forEach((v) =>
    nonnegative(v, "callerFinalSolutionEcMinimum"),
  );
  input.callerFinalSolutionEcMaximum.forEach((v) =>
    nonnegative(v, "callerFinalSolutionEcMaximum"),
  );
  input.observedFinalSolutionEc.forEach((v) =>
    nonnegative(v, "observedFinalSolutionEc"),
  );
  aligned(
    input.callerSeedlingStageIds,
    input.callerFinalSolutionEcMinimum,
    "callerSeedlingStageIds",
  );
  aligned(
    input.callerSeedlingStageIds,
    input.callerFinalSolutionEcMaximum,
    "callerSeedlingStageIds",
  );
  const i = catalogIndex(
      input.callerSeedlingStageIds,
      input.querySeedlingStageId,
    ),
    lo = input.callerFinalSolutionEcMinimum[i],
    hi = input.callerFinalSolutionEcMaximum[i];
  band(0, lo, hi);
  return {
    callerFinalSolutionEcRange: [lo, hi],
    solutionSamplesOutsideCallerEcIndices:
      input.observedFinalSolutionEc.flatMap((v, j) =>
        band(v, lo, hi) < 0 ? [j] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSeedlingStageIds: ["a", "b"],
  callerFinalSolutionEcMinimum: [0.8, 1],
  callerFinalSolutionEcMaximum: [1.2, 1.5],
  querySeedlingStageId: "a",
  observedFinalSolutionEc: [0.7, 1, 1.3],
} satisfies Input;
export const exampleOutput = {
  callerFinalSolutionEcRange: [0.8, 1.2],
  solutionSamplesOutsideCallerEcIndices: [0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/seedling-ec-target-lookup",
  title: "Seedling EC Target Lookup",
  description:
    "Audit actual final nutrient-solution EC against caller seedling-stage band; distinct from source-water ceiling and temperature compensation, no nutrient-ion sufficiency or universal dosing target.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFinalSolutionEcRange",
      label: "Caller final solution ec range",
      kind: "numberList",
    },
    {
      id: "solutionSamplesOutsideCallerEcIndices",
      label: "Solution samples outside caller ec indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSeedlingStageIds: value.callerSeedlingStageIds as readonly string[],
      callerFinalSolutionEcMinimum:
        value.callerFinalSolutionEcMinimum as readonly number[],
      callerFinalSolutionEcMaximum:
        value.callerFinalSolutionEcMaximum as readonly number[],
      querySeedlingStageId: value.querySeedlingStageId as string,
      observedFinalSolutionEc:
        value.observedFinalSolutionEc as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
