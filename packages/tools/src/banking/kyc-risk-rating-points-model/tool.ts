import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerKycFactorIds: readonly string[];
  readonly callerFactorPoints: readonly number[];
  readonly observedFactorAppliesFlags: readonly number[];
  readonly knownFactorEvidenceFlags: readonly number[];
  readonly callerReviewPointsFloor: number;
}>;
export type Output = Readonly<{
  readonly knownKycPoints: number;
  readonly maximumUnresolvedAdditionalPoints: number;
  readonly knownPointsReachReviewFloor: boolean;
  readonly unresolvedEvidenceCouldReachFloor: boolean;
}>;
const inputFields = [
  {
    id: "callerKycFactorIds",
    label: "Caller kyc factor ids",
    kind: "stringList",
  },
  {
    id: "callerFactorPoints",
    label: "Caller factor points",
    kind: "numberList",
  },
  {
    id: "observedFactorAppliesFlags",
    label: "Observed factor applies flags",
    kind: "numberList",
  },
  {
    id: "knownFactorEvidenceFlags",
    label: "Known factor evidence flags",
    kind: "numberList",
  },
  {
    id: "callerReviewPointsFloor",
    label: "Caller review points floor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerKycFactorIds, "factors");
  for (const v of [
    input.callerFactorPoints,
    input.observedFactorAppliesFlags,
    input.knownFactorEvidenceFlags,
  ])
    aligned(input.callerKycFactorIds, v, "factors");
  input.callerFactorPoints.forEach((v) => nonnegative(v, "points"));
  nonnegative(input.callerReviewPointsFloor, "floor");
  binary(input.observedFactorAppliesFlags, "applies");
  binary(input.knownFactorEvidenceFlags, "known");
  const known = sum(
      input.callerFactorPoints.filter(
        (_, i) =>
          input.knownFactorEvidenceFlags[i] &&
          input.observedFactorAppliesFlags[i],
      ),
    ),
    unknown = sum(
      input.callerFactorPoints.filter(
        (_, i) => !input.knownFactorEvidenceFlags[i],
      ),
    );
  return {
    knownKycPoints: known,
    maximumUnresolvedAdditionalPoints: unknown,
    knownPointsReachReviewFloor: known >= input.callerReviewPointsFloor,
    unresolvedEvidenceCouldReachFloor:
      unknown > 0 &&
      known < input.callerReviewPointsFloor &&
      known + unknown >= input.callerReviewPointsFloor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerKycFactorIds: ["geography", "activity"],
  callerFactorPoints: [10, 20],
  observedFactorAppliesFlags: [1, 1],
  knownFactorEvidenceFlags: [1, 0],
  callerReviewPointsFloor: 25,
} satisfies Input;
export const exampleOutput = {
  knownKycPoints: 10,
  maximumUnresolvedAdditionalPoints: 20,
  knownPointsReachReviewFloor: false,
  unresolvedEvidenceCouldReachFloor: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/kyc-risk-rating-points-model",
  title: "KYC Risk Rating Points Model Calculator",
  description:
    "Score caller KYC risk model while separately bounding unresolved evidence, no missing-as-zero risk classification or universal points. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    { id: "knownKycPoints", label: "Known kyc points", kind: "number" },
    {
      id: "maximumUnresolvedAdditionalPoints",
      label: "Maximum unresolved additional points",
      kind: "number",
    },
    {
      id: "knownPointsReachReviewFloor",
      label: "Known points reach review floor",
      kind: "boolean",
    },
    {
      id: "unresolvedEvidenceCouldReachFloor",
      label: "Unresolved evidence could reach floor",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerKycFactorIds: value.callerKycFactorIds as readonly string[],
      callerFactorPoints: value.callerFactorPoints as readonly number[],
      observedFactorAppliesFlags:
        value.observedFactorAppliesFlags as readonly number[],
      knownFactorEvidenceFlags:
        value.knownFactorEvidenceFlags as readonly number[],
      callerReviewPointsFloor: value.callerReviewPointsFloor as number,
    }),
});
export const run = tool.execute;
export default tool;
