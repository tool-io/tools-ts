import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  unique,
  band,
  points,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedMaxHeartRateBpm: number;
  readonly callerZoneIds: readonly string[];
  readonly callerMaxHeartRateFractionRanges: readonly (readonly number[])[];
  readonly observedHeartRateBpm: number;
}>;
export type Output = Readonly<{
  readonly callerZoneHeartRateRangesBpm: readonly (readonly number[])[];
  readonly compatibleCallerHeartRateZoneIds: readonly string[];
}>;
const inputFields = [
  {
    id: "independentlyEstablishedMaxHeartRateBpm",
    label: "Independently established max heart rate bpm",
    kind: "number",
  },
  { id: "callerZoneIds", label: "Caller zone ids", kind: "stringList" },
  {
    id: "callerMaxHeartRateFractionRanges",
    label: "Caller max heart rate fraction ranges",
    kind: "matrix",
  },
  {
    id: "observedHeartRateBpm",
    label: "Observed heart rate bpm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyEstablishedMaxHeartRateBpm,
    "independentlyEstablishedMaxHeartRateBpm",
  );
  positive(input.observedHeartRateBpm, "observedHeartRateBpm");
  unique(input.callerZoneIds, "zones");
  points(input.callerMaxHeartRateFractionRanges);
  aligned(input.callerZoneIds, input.callerMaxHeartRateFractionRanges, "zones");
  const ranges = input.callerMaxHeartRateFractionRanges.map((r) => {
    r.forEach((v) => fraction(v, "fractions"));
    ordered(r[0], r[1]);
    return r.map((v) => v * input.independentlyEstablishedMaxHeartRateBpm);
  });
  return {
    callerZoneHeartRateRangesBpm: ranges,
    compatibleCallerHeartRateZoneIds: input.callerZoneIds.filter(
      (_, i) =>
        band(input.observedHeartRateBpm, ranges[i][0], ranges[i][1]) >= 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyEstablishedMaxHeartRateBpm: 180,
  callerZoneIds: ["easy", "hard"],
  callerMaxHeartRateFractionRanges: [
    [0.5, 0.7],
    [0.8, 0.9],
  ],
  observedHeartRateBpm: 135,
} satisfies Input;
export const exampleOutput = {
  callerZoneHeartRateRangesBpm: [
    [90, 126],
    [144, 162],
  ],
  compatibleCallerHeartRateZoneIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/run-training-zone-heart-rate",
  title: "Run Heart-Rate Training Zone Tool",
  description:
    "Translate caller maximum-HR percentage zones and audit actual HR; distinct from existing reserve/rest-HR Karvonen, no exercise clearance or universal zone labels.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerZoneHeartRateRangesBpm",
      label: "Caller zone heart rate ranges bpm",
      kind: "matrix",
    },
    {
      id: "compatibleCallerHeartRateZoneIds",
      label: "Compatible caller heart rate zone ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyEstablishedMaxHeartRateBpm:
        value.independentlyEstablishedMaxHeartRateBpm as number,
      callerZoneIds: value.callerZoneIds as readonly string[],
      callerMaxHeartRateFractionRanges:
        value.callerMaxHeartRateFractionRanges as readonly (readonly number[])[],
      observedHeartRateBpm: value.observedHeartRateBpm as number,
    }),
});
export const run = tool.execute;
export default tool;
