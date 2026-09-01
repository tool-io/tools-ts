import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedNonoverlappingMatchSegmentMeters: readonly number[];
  readonly segmentTrackingEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownTrackedMatchDistanceKm: number;
  readonly unknownTrackingSegmentCount: number;
}>;
const inputFields = [
  {
    id: "observedNonoverlappingMatchSegmentMeters",
    label: "Observed nonoverlapping match segment meters",
    kind: "numberList",
  },
  {
    id: "segmentTrackingEvidenceFlags",
    label: "Segment tracking evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedNonoverlappingMatchSegmentMeters,
    input.segmentTrackingEvidenceFlags,
    "tracking",
  );
  binary(input.segmentTrackingEvidenceFlags, "evidence");
  input.observedNonoverlappingMatchSegmentMeters.forEach((v) =>
    nonnegative(v, "meters"),
  );
  return {
    knownTrackedMatchDistanceKm:
      sum(
        input.observedNonoverlappingMatchSegmentMeters.filter(
          (_, i) => input.segmentTrackingEvidenceFlags[i],
        ),
      ) / 1000,
    unknownTrackingSegmentCount: input.segmentTrackingEvidenceFlags.filter(
      (v) => !v,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNonoverlappingMatchSegmentMeters: [1000, 1500, 500],
  segmentTrackingEvidenceFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownTrackedMatchDistanceKm: 1.5,
  unknownTrackingSegmentCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/soccer-distance-covered-km-per-match",
  title: "Match Distance Covered km Calculator",
  description:
    "Sum actual nonoverlapping tracked soccer segments, exposing missing tracking rather than extrapolating whole-match distance; no GPS processing/geodesy.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownTrackedMatchDistanceKm",
      label: "Known tracked match distance km",
      kind: "number",
    },
    {
      id: "unknownTrackingSegmentCount",
      label: "Unknown tracking segment count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNonoverlappingMatchSegmentMeters:
        value.observedNonoverlappingMatchSegmentMeters as readonly number[],
      segmentTrackingEvidenceFlags:
        value.segmentTrackingEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
