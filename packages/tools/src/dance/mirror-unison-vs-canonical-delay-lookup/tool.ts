import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  mean,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly referenceMovementTimesCounts: readonly number[];
  readonly partnerMovementTimesCounts: readonly number[];
  readonly referenceSignedLateralDirections: readonly number[];
  readonly partnerSignedLateralDirections: readonly number[];
  readonly callerTimingToleranceCounts: number;
}>;
export type Output = Readonly<{
  readonly measuredPartnerDelayCounts: number;
  readonly withinCallerConstantDelay: boolean;
  readonly spatialRelation: string;
  readonly timingRelation: string;
}>;
const inputFields = [
  {
    id: "referenceMovementTimesCounts",
    label: "Reference movement times counts",
    kind: "numberList",
  },
  {
    id: "partnerMovementTimesCounts",
    label: "Partner movement times counts",
    kind: "numberList",
  },
  {
    id: "referenceSignedLateralDirections",
    label: "Reference signed lateral directions",
    kind: "numberList",
  },
  {
    id: "partnerSignedLateralDirections",
    label: "Partner signed lateral directions",
    kind: "numberList",
  },
  {
    id: "callerTimingToleranceCounts",
    label: "Caller timing tolerance counts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerTimingToleranceCounts, "callerTimingToleranceCounts");
  aligned(
    input.referenceMovementTimesCounts,
    input.partnerMovementTimesCounts,
    "referenceMovementTimesCounts",
  );
  aligned(
    input.referenceMovementTimesCounts,
    input.referenceSignedLateralDirections,
    "referenceMovementTimesCounts",
  );
  aligned(
    input.referenceMovementTimesCounts,
    input.partnerSignedLateralDirections,
    "referenceMovementTimesCounts",
  );
  sequence(input.referenceMovementTimesCounts, "reference");
  sequence(input.partnerMovementTimesCounts, "partner");
  [
    ...input.referenceSignedLateralDirections,
    ...input.partnerSignedLateralDirections,
  ].forEach((v) => {
    if (v !== -1 && v !== 1)
      simpleError(
        "directions",
        "Explicit nonzero signed lateral annotations required.",
      );
  });
  const d = input.partnerMovementTimesCounts.map(
      (v, i) => v - input.referenceMovementTimesCounts[i],
    ),
    delay = mean(d),
    consistent = d.every(
      (v) => Math.abs(v - delay) <= input.callerTimingToleranceCounts,
    ),
    mirror = input.partnerSignedLateralDirections.every(
      (v, i) => v === -input.referenceSignedLateralDirections[i],
    ),
    same = input.partnerSignedLateralDirections.every(
      (v, i) => v === input.referenceSignedLateralDirections[i],
    );
  return {
    measuredPartnerDelayCounts: delay,
    withinCallerConstantDelay: consistent,
    spatialRelation: mirror ? "mirrored" : same ? "same-direction" : "mixed",
    timingRelation: !consistent
      ? "variable-offset"
      : Math.abs(delay) <= input.callerTimingToleranceCounts
        ? "unison"
        : "delayed-canon",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceMovementTimesCounts: [0, 1, 2],
  partnerMovementTimesCounts: [2, 3, 4],
  referenceSignedLateralDirections: [1, -1, 1],
  partnerSignedLateralDirections: [-1, 1, -1],
  callerTimingToleranceCounts: 0.1,
} satisfies Input;
export const exampleOutput = {
  measuredPartnerDelayCounts: 2,
  withinCallerConstantDelay: true,
  spatialRelation: "mirrored",
  timingRelation: "delayed-canon",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/mirror-unison-vs-canonical-delay-lookup",
  title: "Mirror Unison vs Canonical Delay Lookup",
  description:
    "Separate actual paired movement spatial mirror/same-direction annotations from measured unison/constant canon/variable timing; mirror does not imply unison or infer choreography from video.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredPartnerDelayCounts",
      label: "Measured partner delay counts",
      kind: "number",
    },
    {
      id: "withinCallerConstantDelay",
      label: "Within caller constant delay",
      kind: "boolean",
    },
    { id: "spatialRelation", label: "Spatial relation", kind: "string" },
    { id: "timingRelation", label: "Timing relation", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      referenceMovementTimesCounts:
        value.referenceMovementTimesCounts as readonly number[],
      partnerMovementTimesCounts:
        value.partnerMovementTimesCounts as readonly number[],
      referenceSignedLateralDirections:
        value.referenceSignedLateralDirections as readonly number[],
      partnerSignedLateralDirections:
        value.partnerSignedLateralDirections as readonly number[],
      callerTimingToleranceCounts: value.callerTimingToleranceCounts as number,
    }),
});
export const run = tool.execute;
export default tool;
