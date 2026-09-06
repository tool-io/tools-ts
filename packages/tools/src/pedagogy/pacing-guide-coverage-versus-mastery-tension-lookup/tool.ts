import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerObjectiveIds: readonly string[];
  readonly observedCoveredFlags: readonly number[];
  readonly independentlyObservedMasteryFlags: readonly number[];
  readonly knownMasteryFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly coveredButKnownUnmasteredIds: readonly string[];
  readonly coveredButUnknownMasteryIds: readonly string[];
  readonly uncoveredObjectiveIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerObjectiveIds",
    label: "Caller objective ids",
    kind: "stringList",
  },
  {
    id: "observedCoveredFlags",
    label: "Observed covered flags",
    kind: "numberList",
  },
  {
    id: "independentlyObservedMasteryFlags",
    label: "Independently observed mastery flags",
    kind: "numberList",
  },
  { id: "knownMasteryFlags", label: "Known mastery flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.observedCoveredFlags, "observedCoveredFlags");
  binary(
    input.independentlyObservedMasteryFlags,
    "independentlyObservedMasteryFlags",
  );
  binary(input.knownMasteryFlags, "knownMasteryFlags");
  aligned(
    input.callerObjectiveIds,
    input.observedCoveredFlags,
    "callerObjectiveIds",
  );
  aligned(
    input.callerObjectiveIds,
    input.independentlyObservedMasteryFlags,
    "callerObjectiveIds",
  );
  aligned(
    input.callerObjectiveIds,
    input.knownMasteryFlags,
    "callerObjectiveIds",
  );
  unique(input.callerObjectiveIds, "objectives");
  return {
    coveredButKnownUnmasteredIds: input.callerObjectiveIds.filter(
      (_, i) =>
        input.observedCoveredFlags[i] &&
        input.knownMasteryFlags[i] &&
        !input.independentlyObservedMasteryFlags[i],
    ),
    coveredButUnknownMasteryIds: input.callerObjectiveIds.filter(
      (_, i) => input.observedCoveredFlags[i] && !input.knownMasteryFlags[i],
    ),
    uncoveredObjectiveIds: input.callerObjectiveIds.filter(
      (_, i) => !input.observedCoveredFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObjectiveIds: ["a", "b", "c"],
  observedCoveredFlags: [1, 1, 0],
  independentlyObservedMasteryFlags: [1, 0, 0],
  knownMasteryFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  coveredButKnownUnmasteredIds: [],
  coveredButUnknownMasteryIds: ["b"],
  uncoveredObjectiveIds: ["c"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/pacing-guide-coverage-versus-mastery-tension-lookup",
  title: "Pacing Guide Coverage Versus Mastery Tension Lookup",
  description:
    "Actual coverage versus independently known mastery ledger; unknown is not failed, neither curriculum compacting nor mastery retry tracker. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "coveredButKnownUnmasteredIds",
      label: "Covered but known unmastered ids",
      kind: "stringList",
    },
    {
      id: "coveredButUnknownMasteryIds",
      label: "Covered but unknown mastery ids",
      kind: "stringList",
    },
    {
      id: "uncoveredObjectiveIds",
      label: "Uncovered objective ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObjectiveIds: value.callerObjectiveIds as readonly string[],
      observedCoveredFlags: value.observedCoveredFlags as readonly number[],
      independentlyObservedMasteryFlags:
        value.independentlyObservedMasteryFlags as readonly number[],
      knownMasteryFlags: value.knownMasteryFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
