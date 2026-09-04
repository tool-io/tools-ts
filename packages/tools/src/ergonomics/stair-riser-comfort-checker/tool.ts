import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedObservedRiserToFunctionalStepRatio: readonly number[];
  readonly callerVerifiedObservedRiserToFunctionalStepRatioLower: readonly number[];
  readonly callerVerifiedObservedRiserToFunctionalStepRatioUpper: readonly number[];
  readonly knownObservedRiserToFunctionalStepRatioCriteriaFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriteriaIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedRiserToFunctionalStepRatio",
    label: "Observed observed riser to functional step ratio",
    kind: "numberList",
  },
  {
    id: "callerVerifiedObservedRiserToFunctionalStepRatioLower",
    label: "Caller verified observed riser to functional step ratio lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedObservedRiserToFunctionalStepRatioUpper",
    label: "Caller verified observed riser to functional step ratio upper",
    kind: "numberList",
  },
  {
    id: "knownObservedRiserToFunctionalStepRatioCriteriaFlags",
    label: "Known observed riser to functional step ratio criteria flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownObservedRiserToFunctionalStepRatioCriteriaFlags,
    "knownObservedRiserToFunctionalStepRatioCriteriaFlags",
  );
  aligned(
    input.observedObservedRiserToFunctionalStepRatio,
    input.callerVerifiedObservedRiserToFunctionalStepRatioLower,
    "observedObservedRiserToFunctionalStepRatio",
  );
  aligned(
    input.observedObservedRiserToFunctionalStepRatio,
    input.callerVerifiedObservedRiserToFunctionalStepRatioUpper,
    "observedObservedRiserToFunctionalStepRatio",
  );
  aligned(
    input.observedObservedRiserToFunctionalStepRatio,
    input.knownObservedRiserToFunctionalStepRatioCriteriaFlags,
    "observedObservedRiserToFunctionalStepRatio",
  );
  input.callerVerifiedObservedRiserToFunctionalStepRatioLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedObservedRiserToFunctionalStepRatioUpper[i]),
  );
  return {
    signedKnownMargins: input.observedObservedRiserToFunctionalStepRatio.map(
      (v, i) =>
        input.knownObservedRiserToFunctionalStepRatioCriteriaFlags[i]
          ? Math.min(
              v -
                input.callerVerifiedObservedRiserToFunctionalStepRatioLower[i],
              input.callerVerifiedObservedRiserToFunctionalStepRatioUpper[i] -
                v,
            )
          : 0,
    ),
    knownReviewIndices:
      input.observedObservedRiserToFunctionalStepRatio.flatMap((v, i) =>
        input.knownObservedRiserToFunctionalStepRatioCriteriaFlags[i] &&
        (v < input.callerVerifiedObservedRiserToFunctionalStepRatioLower[i] ||
          v > input.callerVerifiedObservedRiserToFunctionalStepRatioUpper[i])
          ? [i]
          : [],
      ),
    unknownCriteriaIndices:
      input.knownObservedRiserToFunctionalStepRatioCriteriaFlags.flatMap(
        (v, i) => (!v ? [i] : []),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedRiserToFunctionalStepRatio: [2, 5],
  callerVerifiedObservedRiserToFunctionalStepRatioLower: [1, 1],
  callerVerifiedObservedRiserToFunctionalStepRatioUpper: [3, 4],
  knownObservedRiserToFunctionalStepRatioCriteriaFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownCriteriaIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/stair-riser-comfort-checker",
  title: "Anthropometric Step Height Stair Riser Comfort Checker",
  description:
    "Actual stair-riser/functional-step ratio vs caller task/person comfort bands; caller independently measures ratio, no stair-code compliance. Unknown criteria explicitly distinguish zero placeholders. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    {
      id: "unknownCriteriaIndices",
      label: "Unknown criteria indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedObservedRiserToFunctionalStepRatio:
        value.observedObservedRiserToFunctionalStepRatio as readonly number[],
      callerVerifiedObservedRiserToFunctionalStepRatioLower:
        value.callerVerifiedObservedRiserToFunctionalStepRatioLower as readonly number[],
      callerVerifiedObservedRiserToFunctionalStepRatioUpper:
        value.callerVerifiedObservedRiserToFunctionalStepRatioUpper as readonly number[],
      knownObservedRiserToFunctionalStepRatioCriteriaFlags:
        value.knownObservedRiserToFunctionalStepRatioCriteriaFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
