import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerBeetleFactorPoints: readonly number[];
  readonly observedFactorPresentFlags: readonly number[];
  readonly knownFactorEvidenceFlags: readonly number[];
  readonly callerReviewPointsThreshold: number;
}>;
export type Output = Readonly<{
  readonly knownBeetleReviewPoints: number;
  readonly maximumUnresolvedBeetlePoints: number;
  readonly unknownEvidenceCanCrossReviewThreshold: boolean;
}>;
const inputFields = [
  {
    id: "callerBeetleFactorPoints",
    label: "Caller beetle factor points",
    kind: "numberList",
  },
  {
    id: "observedFactorPresentFlags",
    label: "Observed factor present flags",
    kind: "numberList",
  },
  {
    id: "knownFactorEvidenceFlags",
    label: "Known factor evidence flags",
    kind: "numberList",
  },
  {
    id: "callerReviewPointsThreshold",
    label: "Caller review points threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerBeetleFactorPoints.forEach((v) =>
    nonnegative(v, "callerBeetleFactorPoints"),
  );
  nonnegative(input.callerReviewPointsThreshold, "callerReviewPointsThreshold");
  binary(input.observedFactorPresentFlags, "observedFactorPresentFlags");
  binary(input.knownFactorEvidenceFlags, "knownFactorEvidenceFlags");
  aligned(
    input.callerBeetleFactorPoints,
    input.observedFactorPresentFlags,
    "callerBeetleFactorPoints",
  );
  aligned(
    input.callerBeetleFactorPoints,
    input.knownFactorEvidenceFlags,
    "callerBeetleFactorPoints",
  );
  const known = sum(
      input.callerBeetleFactorPoints.filter(
        (_, i) =>
          input.knownFactorEvidenceFlags[i] &&
          input.observedFactorPresentFlags[i],
      ),
    ),
    unknown = sum(
      input.callerBeetleFactorPoints.filter(
        (_, i) => !input.knownFactorEvidenceFlags[i],
      ),
    );
  return {
    knownBeetleReviewPoints: known,
    maximumUnresolvedBeetlePoints: unknown,
    unknownEvidenceCanCrossReviewThreshold:
      known < input.callerReviewPointsThreshold &&
      known + unknown >= input.callerReviewPointsThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBeetleFactorPoints: [10, 20],
  observedFactorPresentFlags: [1, 1],
  knownFactorEvidenceFlags: [1, 0],
  callerReviewPointsThreshold: 25,
} satisfies Input;
export const exampleOutput = {
  knownBeetleReviewPoints: 10,
  maximumUnresolvedBeetlePoints: 20,
  unknownEvidenceCanCrossReviewThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/mountain-pine-beetle-outbreak-risk-score",
  title: "Mountain Pine Beetle Outbreak Risk Score",
  description:
    "Audit caller calibrated mountain-pine-beetle multi-factor review points with unknown evidence bounds, distinct from host basal-area fraction; no outbreak probability. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownBeetleReviewPoints",
      label: "Known beetle review points",
      kind: "number",
    },
    {
      id: "maximumUnresolvedBeetlePoints",
      label: "Maximum unresolved beetle points",
      kind: "number",
    },
    {
      id: "unknownEvidenceCanCrossReviewThreshold",
      label: "Unknown evidence can cross review threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBeetleFactorPoints:
        value.callerBeetleFactorPoints as readonly number[],
      observedFactorPresentFlags:
        value.observedFactorPresentFlags as readonly number[],
      knownFactorEvidenceFlags:
        value.knownFactorEvidenceFlags as readonly number[],
      callerReviewPointsThreshold: value.callerReviewPointsThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
