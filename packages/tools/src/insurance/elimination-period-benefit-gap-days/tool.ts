import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  binary,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerQualifyingDisabilityDays: readonly number[];
  readonly callerRequiredEliminationDays: number;
  readonly callerDaysMustBeConsecutive: boolean;
}>;
export type Output = Readonly<{
  readonly observedLongestQualifyingRunDays: number;
  readonly observedTotalQualifyingDays: number;
  readonly callerEliminationDayRequirementReached: boolean;
}>;
const inputFields = [
  {
    id: "callerQualifyingDisabilityDays",
    label: "Caller qualifying disability days",
    kind: "numberList",
  },
  {
    id: "callerRequiredEliminationDays",
    label: "Caller required elimination days",
    kind: "number",
  },
  {
    id: "callerDaysMustBeConsecutive",
    label: "Caller days must be consecutive",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerQualifyingDisabilityDays, "days");
  bounded(input.callerRequiredEliminationDays, "days", 1, 10000);
  let run = 0,
    longest = 0;
  input.callerQualifyingDisabilityDays.forEach((v) => {
    run = v ? run + 1 : 0;
    longest = Math.max(longest, run);
  });
  const total = sum(input.callerQualifyingDisabilityDays);
  return {
    observedLongestQualifyingRunDays: longest,
    observedTotalQualifyingDays: total,
    callerEliminationDayRequirementReached:
      (input.callerDaysMustBeConsecutive ? longest : total) >=
      input.callerRequiredEliminationDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerQualifyingDisabilityDays: [1, 1, 0, 1, 1],
  callerRequiredEliminationDays: 3,
  callerDaysMustBeConsecutive: true,
} satisfies Input;
export const exampleOutput = {
  observedLongestQualifyingRunDays: 2,
  observedTotalQualifyingDays: 4,
  callerEliminationDayRequirementReached: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/elimination-period-benefit-gap-days",
  title: "Elimination Period Benefit Gap Days Calculator",
  description:
    "Audit actual daily qualifying-day annotations under caller consecutive versus cumulative elimination policy; not prior-coverage waiting credit or validating medical disability.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLongestQualifyingRunDays",
      label: "Observed longest qualifying run days",
      kind: "number",
    },
    {
      id: "observedTotalQualifyingDays",
      label: "Observed total qualifying days",
      kind: "number",
    },
    {
      id: "callerEliminationDayRequirementReached",
      label: "Caller elimination day requirement reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerQualifyingDisabilityDays:
        value.callerQualifyingDisabilityDays as readonly number[],
      callerRequiredEliminationDays:
        value.callerRequiredEliminationDays as number,
      callerDaysMustBeConsecutive: value.callerDaysMustBeConsecutive as boolean,
    }),
});
export const run = tool.execute;
export default tool;
