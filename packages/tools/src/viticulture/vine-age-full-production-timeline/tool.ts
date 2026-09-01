import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedVineAgesYears: readonly number[];
  readonly observedMatchedYieldKgPerVine: readonly number[];
  readonly callerFullProductionYieldKgPerVine: number;
}>;
export type Output = Readonly<{
  readonly firstObservedAgeMeetingCallerYieldYears: number;
  readonly callerYieldReachedWithinObservations: boolean;
  readonly lastObservedYieldKgPerVine: number;
}>;
const inputFields = [
  {
    id: "observedVineAgesYears",
    label: "Observed vine ages years",
    kind: "numberList",
  },
  {
    id: "observedMatchedYieldKgPerVine",
    label: "Observed matched yield kg per vine",
    kind: "numberList",
  },
  {
    id: "callerFullProductionYieldKgPerVine",
    label: "Caller full production yield kg per vine",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedVineAgesYears.forEach((v) =>
    nonnegative(v, "observedVineAgesYears"),
  );
  input.observedMatchedYieldKgPerVine.forEach((v) =>
    nonnegative(v, "observedMatchedYieldKgPerVine"),
  );
  nonnegative(
    input.callerFullProductionYieldKgPerVine,
    "callerFullProductionYieldKgPerVine",
  );
  aligned(
    input.observedVineAgesYears,
    input.observedMatchedYieldKgPerVine,
    "observedVineAgesYears",
  );
  strictlyIncreasing(input.observedVineAgesYears, "ages");
  const i = input.observedMatchedYieldKgPerVine.findIndex(
    (v) => v >= input.callerFullProductionYieldKgPerVine,
  );
  return {
    firstObservedAgeMeetingCallerYieldYears:
      i < 0 ? -1 : input.observedVineAgesYears[i],
    callerYieldReachedWithinObservations: i >= 0,
    lastObservedYieldKgPerVine: input.observedMatchedYieldKgPerVine.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVineAgesYears: [1, 2, 3, 4],
  observedMatchedYieldKgPerVine: [1, 2, 4, 5],
  callerFullProductionYieldKgPerVine: 4,
} satisfies Input;
export const exampleOutput = {
  firstObservedAgeMeetingCallerYieldYears: 3,
  callerYieldReachedWithinObservations: true,
  lastObservedYieldKgPerVine: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/vine-age-full-production-timeline",
  title: "Vine Age Full Production Timeline Lookup",
  description:
    "Locate first actually observed age achieving caller matched-cohort yield criterion, no interpolation/extrapolation or universal full-production age; age/yield association not causal maturation proof.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstObservedAgeMeetingCallerYieldYears",
      label: "First observed age meeting caller yield years",
      kind: "number",
    },
    {
      id: "callerYieldReachedWithinObservations",
      label: "Caller yield reached within observations",
      kind: "boolean",
    },
    {
      id: "lastObservedYieldKgPerVine",
      label: "Last observed yield kg per vine",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVineAgesYears: value.observedVineAgesYears as readonly number[],
      observedMatchedYieldKgPerVine:
        value.observedMatchedYieldKgPerVine as readonly number[],
      callerFullProductionYieldKgPerVine:
        value.callerFullProductionYieldKgPerVine as number,
    }),
});
export const run = tool.execute;
export default tool;
