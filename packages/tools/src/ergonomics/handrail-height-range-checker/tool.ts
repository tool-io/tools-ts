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
  readonly observedMeasuredHandrailAboveStepHeight: readonly number[];
  readonly callerVerifiedMeasuredHandrailAboveStepHeightLower: readonly number[];
  readonly callerVerifiedMeasuredHandrailAboveStepHeightUpper: readonly number[];
  readonly knownMeasuredHandrailAboveStepHeightCriteriaFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriteriaIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMeasuredHandrailAboveStepHeight",
    label: "Observed measured handrail above step height",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMeasuredHandrailAboveStepHeightLower",
    label: "Caller verified measured handrail above step height lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMeasuredHandrailAboveStepHeightUpper",
    label: "Caller verified measured handrail above step height upper",
    kind: "numberList",
  },
  {
    id: "knownMeasuredHandrailAboveStepHeightCriteriaFlags",
    label: "Known measured handrail above step height criteria flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownMeasuredHandrailAboveStepHeightCriteriaFlags,
    "knownMeasuredHandrailAboveStepHeightCriteriaFlags",
  );
  aligned(
    input.observedMeasuredHandrailAboveStepHeight,
    input.callerVerifiedMeasuredHandrailAboveStepHeightLower,
    "observedMeasuredHandrailAboveStepHeight",
  );
  aligned(
    input.observedMeasuredHandrailAboveStepHeight,
    input.callerVerifiedMeasuredHandrailAboveStepHeightUpper,
    "observedMeasuredHandrailAboveStepHeight",
  );
  aligned(
    input.observedMeasuredHandrailAboveStepHeight,
    input.knownMeasuredHandrailAboveStepHeightCriteriaFlags,
    "observedMeasuredHandrailAboveStepHeight",
  );
  input.callerVerifiedMeasuredHandrailAboveStepHeightLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedMeasuredHandrailAboveStepHeightUpper[i]),
  );
  return {
    signedKnownMargins: input.observedMeasuredHandrailAboveStepHeight.map(
      (v, i) =>
        input.knownMeasuredHandrailAboveStepHeightCriteriaFlags[i]
          ? Math.min(
              v - input.callerVerifiedMeasuredHandrailAboveStepHeightLower[i],
              input.callerVerifiedMeasuredHandrailAboveStepHeightUpper[i] - v,
            )
          : 0,
    ),
    knownReviewIndices: input.observedMeasuredHandrailAboveStepHeight.flatMap(
      (v, i) =>
        input.knownMeasuredHandrailAboveStepHeightCriteriaFlags[i] &&
        (v < input.callerVerifiedMeasuredHandrailAboveStepHeightLower[i] ||
          v > input.callerVerifiedMeasuredHandrailAboveStepHeightUpper[i])
          ? [i]
          : [],
    ),
    unknownCriteriaIndices:
      input.knownMeasuredHandrailAboveStepHeightCriteriaFlags.flatMap((v, i) =>
        !v ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMeasuredHandrailAboveStepHeight: [2, 5],
  callerVerifiedMeasuredHandrailAboveStepHeightLower: [1, 1],
  callerVerifiedMeasuredHandrailAboveStepHeightUpper: [3, 4],
  knownMeasuredHandrailAboveStepHeightCriteriaFlags: [1, 0],
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
  id: "ergonomics/handrail-height-range-checker",
  title: "Anthropometric Handrail Height Optimal Range Checker",
  description:
    "Measured handrail height above local tread against caller posture/accessibility context interval, not body-height universal optimum. Unknown criteria explicitly distinguish zero placeholders. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedMeasuredHandrailAboveStepHeight:
        value.observedMeasuredHandrailAboveStepHeight as readonly number[],
      callerVerifiedMeasuredHandrailAboveStepHeightLower:
        value.callerVerifiedMeasuredHandrailAboveStepHeightLower as readonly number[],
      callerVerifiedMeasuredHandrailAboveStepHeightUpper:
        value.callerVerifiedMeasuredHandrailAboveStepHeightUpper as readonly number[],
      knownMeasuredHandrailAboveStepHeightCriteriaFlags:
        value.knownMeasuredHandrailAboveStepHeightCriteriaFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
