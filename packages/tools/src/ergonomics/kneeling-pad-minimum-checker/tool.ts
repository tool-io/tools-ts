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
  readonly observedKneelingPadLoadedThickness: readonly number[];
  readonly callerVerifiedKneelingPadLoadedThicknessLower: readonly number[];
  readonly callerVerifiedKneelingPadLoadedThicknessUpper: readonly number[];
  readonly knownKneelingPadLoadedThicknessCriteriaFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriteriaIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedKneelingPadLoadedThickness",
    label: "Observed kneeling pad loaded thickness",
    kind: "numberList",
  },
  {
    id: "callerVerifiedKneelingPadLoadedThicknessLower",
    label: "Caller verified kneeling pad loaded thickness lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedKneelingPadLoadedThicknessUpper",
    label: "Caller verified kneeling pad loaded thickness upper",
    kind: "numberList",
  },
  {
    id: "knownKneelingPadLoadedThicknessCriteriaFlags",
    label: "Known kneeling pad loaded thickness criteria flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownKneelingPadLoadedThicknessCriteriaFlags,
    "knownKneelingPadLoadedThicknessCriteriaFlags",
  );
  aligned(
    input.observedKneelingPadLoadedThickness,
    input.callerVerifiedKneelingPadLoadedThicknessLower,
    "observedKneelingPadLoadedThickness",
  );
  aligned(
    input.observedKneelingPadLoadedThickness,
    input.callerVerifiedKneelingPadLoadedThicknessUpper,
    "observedKneelingPadLoadedThickness",
  );
  aligned(
    input.observedKneelingPadLoadedThickness,
    input.knownKneelingPadLoadedThicknessCriteriaFlags,
    "observedKneelingPadLoadedThickness",
  );
  input.callerVerifiedKneelingPadLoadedThicknessLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedKneelingPadLoadedThicknessUpper[i]),
  );
  return {
    signedKnownMargins: input.observedKneelingPadLoadedThickness.map((v, i) =>
      input.knownKneelingPadLoadedThicknessCriteriaFlags[i]
        ? Math.min(
            v - input.callerVerifiedKneelingPadLoadedThicknessLower[i],
            input.callerVerifiedKneelingPadLoadedThicknessUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedKneelingPadLoadedThickness.flatMap(
      (v, i) =>
        input.knownKneelingPadLoadedThicknessCriteriaFlags[i] &&
        (v < input.callerVerifiedKneelingPadLoadedThicknessLower[i] ||
          v > input.callerVerifiedKneelingPadLoadedThicknessUpper[i])
          ? [i]
          : [],
    ),
    unknownCriteriaIndices:
      input.knownKneelingPadLoadedThicknessCriteriaFlags.flatMap((v, i) =>
        !v ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedKneelingPadLoadedThickness: [2, 5],
  callerVerifiedKneelingPadLoadedThicknessLower: [1, 1],
  callerVerifiedKneelingPadLoadedThicknessUpper: [3, 4],
  knownKneelingPadLoadedThicknessCriteriaFlags: [1, 0],
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
  id: "ergonomics/kneeling-pad-minimum-checker",
  title: "Kneeling Pad Thickness Comfort Minimum Rule Checker",
  description:
    "Compare measured loaded-pad thickness under independently matched knee/task loads to caller comfort intervals, not unloaded foam thickness or universal injury rule. Unknown criteria explicitly distinguish zero placeholders. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedKneelingPadLoadedThickness:
        value.observedKneelingPadLoadedThickness as readonly number[],
      callerVerifiedKneelingPadLoadedThicknessLower:
        value.callerVerifiedKneelingPadLoadedThicknessLower as readonly number[],
      callerVerifiedKneelingPadLoadedThicknessUpper:
        value.callerVerifiedKneelingPadLoadedThicknessUpper as readonly number[],
      knownKneelingPadLoadedThicknessCriteriaFlags:
        value.knownKneelingPadLoadedThicknessCriteriaFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
