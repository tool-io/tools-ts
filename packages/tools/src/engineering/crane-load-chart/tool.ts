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
  readonly observedCraneLoad: readonly number[];
  readonly callerVerifiedCraneLoadLower: readonly number[];
  readonly callerVerifiedCraneLoadUpper: readonly number[];
  readonly knownCraneLoadCriterionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownBandMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownCriterionIndices: readonly number[];
}>;
const inputFields = [
  { id: "observedCraneLoad", label: "Observed crane load", kind: "numberList" },
  {
    id: "callerVerifiedCraneLoadLower",
    label: "Caller verified crane load lower",
    kind: "numberList",
  },
  {
    id: "callerVerifiedCraneLoadUpper",
    label: "Caller verified crane load upper",
    kind: "numberList",
  },
  {
    id: "knownCraneLoadCriterionFlags",
    label: "Known crane load criterion flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.knownCraneLoadCriterionFlags, "knownCraneLoadCriterionFlags");
  aligned(
    input.observedCraneLoad,
    input.callerVerifiedCraneLoadLower,
    "observedCraneLoad",
  );
  aligned(
    input.observedCraneLoad,
    input.callerVerifiedCraneLoadUpper,
    "observedCraneLoad",
  );
  aligned(
    input.observedCraneLoad,
    input.knownCraneLoadCriterionFlags,
    "observedCraneLoad",
  );
  input.callerVerifiedCraneLoadLower.forEach((v, i) =>
    ordered(v, input.callerVerifiedCraneLoadUpper[i]),
  );
  return {
    signedKnownBandMargins: input.observedCraneLoad.map((v, i) =>
      input.knownCraneLoadCriterionFlags[i]
        ? Math.min(
            v - input.callerVerifiedCraneLoadLower[i],
            input.callerVerifiedCraneLoadUpper[i] - v,
          )
        : 0,
    ),
    knownReviewIndices: input.observedCraneLoad.flatMap((v, i) =>
      input.knownCraneLoadCriterionFlags[i] &&
      (v < input.callerVerifiedCraneLoadLower[i] ||
        v > input.callerVerifiedCraneLoadUpper[i])
        ? [i]
        : [],
    ),
    unknownCriterionIndices: input.knownCraneLoadCriterionFlags.flatMap(
      (v, i) => (!v ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCraneLoad: [2, 5],
  callerVerifiedCraneLoadLower: [1, 1],
  callerVerifiedCraneLoadUpper: [3, 4],
  knownCraneLoadCriterionFlags: [1, 0],
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
  id: "engineering/crane-load-chart",
  title: "Crane Load Chart Calculator",
  description:
    "Audit actual observed crane load against independently verified exact radius/boom/configuration load-chart bands; no interpolated capacity or lift authorization. Unknown criterion indices distinguish zero placeholders from known zero margins. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
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
      observedCraneLoad: value.observedCraneLoad as readonly number[],
      callerVerifiedCraneLoadLower:
        value.callerVerifiedCraneLoadLower as readonly number[],
      callerVerifiedCraneLoadUpper:
        value.callerVerifiedCraneLoadUpper as readonly number[],
      knownCraneLoadCriterionFlags:
        value.knownCraneLoadCriterionFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
