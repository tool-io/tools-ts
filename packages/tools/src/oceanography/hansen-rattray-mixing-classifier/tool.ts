import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedHansenRattrayCoordinate: readonly number[];
  readonly callerVerifiedHansenRattrayCoordinateLower: readonly number[];
  readonly callerVerifiedHansenRattrayCoordinateUpper: readonly number[];
  readonly knownHansenRattrayCoordinateCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedHansenRattrayCoordinate",
    label: "Observed hansen rattray coordinate",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHansenRattrayCoordinateLower",
    label: "Caller verified hansen rattray coordinate lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedHansenRattrayCoordinateUpper",
    label: "Caller verified hansen rattray coordinate upper",
    kind: "numberList",
  },
  {
    id: "knownHansenRattrayCoordinateCriterionFlags",
    label: "Known hansen rattray coordinate criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(
    input.knownHansenRattrayCoordinateCriterionFlags,
    "knownHansenRattrayCoordinateCriterionFlags",
  );
  aligned(
    input.observedHansenRattrayCoordinate,
    input.callerVerifiedHansenRattrayCoordinateLower,
    "observedHansenRattrayCoordinate",
  );
  aligned(
    input.observedHansenRattrayCoordinate,
    input.callerVerifiedHansenRattrayCoordinateUpper,
    "observedHansenRattrayCoordinate",
  );
  aligned(
    input.observedHansenRattrayCoordinate,
    input.knownHansenRattrayCoordinateCriterionFlags,
    "observedHansenRattrayCoordinate",
  );
  input.callerVerifiedHansenRattrayCoordinateLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedHansenRattrayCoordinateUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedHansenRattrayCoordinate.map((v, i) =>
      input.knownHansenRattrayCoordinateCriterionFlags[i]
        ? Math.min(
            v - input.callerVerifiedHansenRattrayCoordinateLower[i],
            input.callerVerifiedHansenRattrayCoordinateUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedHansenRattrayCoordinate.flatMap((v, i) =>
      input.knownHansenRattrayCoordinateCriterionFlags[i] &&
      (v < input.callerVerifiedHansenRattrayCoordinateLower[i] ||
        v > input.callerVerifiedHansenRattrayCoordinateUpper[i])
        ? [i]
        : [],
    ),
    unknownCriterionIndices:
      input.knownHansenRattrayCoordinateCriterionFlags.flatMap((v, i) =>
        !v ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHansenRattrayCoordinate: [2, 5],
  callerVerifiedHansenRattrayCoordinateLower: [1, 1],
  callerVerifiedHansenRattrayCoordinateUpper: [3, 4],
  knownHansenRattrayCoordinateCriterionFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownBandMargins: [1, 0],
  knownReviewIndices: [],
  unknownCriterionIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/hansen-rattray-mixing-classifier",
  title: "Hansen Rattray Mixing Classifier",
  description:
    "Audit independently computed normalized surface/mean circulation or bottom/surface salinity contrast against caller reference-chart coordinate bands; no forced estuary class or ambiguous chart resolution. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownBandMargins",
      label: "Signed known band margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    {
      id: "unknownCriterionIndices",
      label: "Unknown criterion indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHansenRattrayCoordinate:
        value.observedHansenRattrayCoordinate as readonly number[],
      callerVerifiedHansenRattrayCoordinateLower:
        value.callerVerifiedHansenRattrayCoordinateLower as readonly number[],
      callerVerifiedHansenRattrayCoordinateUpper:
        value.callerVerifiedHansenRattrayCoordinateUpper as readonly number[],
      knownHansenRattrayCoordinateCriterionFlags:
        value.knownHansenRattrayCoordinateCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
