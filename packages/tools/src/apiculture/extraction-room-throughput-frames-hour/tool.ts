import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly stationNominalFramesPerHour: readonly number[];
  readonly parallelStationCounts: readonly number[];
  readonly productiveFractions: readonly number[];
  readonly shiftHours: number;
  readonly commonSetupHours: number;
}>;
export type Output = Readonly<{
  readonly stationEffectiveFramesPerHour: readonly number[];
  readonly lineFramesPerHour: number;
  readonly bottleneckStationIndexes: readonly number[];
  readonly completeFramesPerShift: number;
}>;
const inputFields = [
  {
    id: "stationNominalFramesPerHour",
    label: "Station nominal frames per hour",
    kind: "numberList",
  },
  {
    id: "parallelStationCounts",
    label: "Parallel station counts",
    kind: "numberList",
  },
  {
    id: "productiveFractions",
    label: "Productive fractions",
    kind: "numberList",
  },
  { id: "shiftHours", label: "Shift hours", kind: "number" },
  { id: "commonSetupHours", label: "Common setup hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stationNominalFramesPerHour.forEach((v) =>
    positive(v, "stationNominalFramesPerHour"),
  );
  input.parallelStationCounts.forEach((v) =>
    positive(v, "parallelStationCounts"),
  );
  positive(input.shiftHours, "shiftHours");
  nonnegative(input.commonSetupHours, "commonSetupHours");
  input.productiveFractions.forEach((v) => fraction(v, "productiveFractions"));
  input.parallelStationCounts.forEach((v) => count(v, "parallelStationCounts"));
  aligned(
    input.stationNominalFramesPerHour,
    input.parallelStationCounts,
    "stationNominalFramesPerHour",
  );
  aligned(
    input.stationNominalFramesPerHour,
    input.productiveFractions,
    "stationNominalFramesPerHour",
  );
  const hours = nonnegative(
      input.shiftHours - input.commonSetupHours,
      "commonSetupHours",
    ),
    stationEffectiveFramesPerHour = input.stationNominalFramesPerHour.map(
      (v, i) =>
        v * input.parallelStationCounts[i] * input.productiveFractions[i],
    ),
    lineFramesPerHour = minimum(stationEffectiveFramesPerHour);
  return {
    stationEffectiveFramesPerHour,
    lineFramesPerHour,
    bottleneckStationIndexes: stationEffectiveFramesPerHour
      .map((v, i) => (v === lineFramesPerHour ? i : -1))
      .filter((i) => i >= 0),
    completeFramesPerShift: count(
      Math.floor(lineFramesPerHour * hours),
      "completeFramesPerShift",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stationNominalFramesPerHour: [100, 50, 80],
  parallelStationCounts: [1, 2, 1],
  productiveFractions: [0.5, 0.8, 1],
  shiftHours: 4,
  commonSetupHours: 0.5,
} satisfies Input;
export const exampleOutput = {
  stationEffectiveFramesPerHour: [50, 80, 80],
  lineFramesPerHour: 50,
  bottleneckStationIndexes: [0],
  completeFramesPerShift: 175,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/extraction-room-throughput-frames-hour",
  title: "Extraction Room Throughput Frames Hour",
  description:
    "Screen serial extraction-room bottlenecks including parallel stations, productive fractions and common setup; assumes adequate buffering and no hidden batch dependencies.",
  inputs: inputFields,
  outputs: [
    {
      id: "stationEffectiveFramesPerHour",
      label: "Station effective frames per hour",
      kind: "numberList",
    },
    { id: "lineFramesPerHour", label: "Line frames per hour", kind: "number" },
    {
      id: "bottleneckStationIndexes",
      label: "Bottleneck station indexes",
      kind: "numberList",
    },
    {
      id: "completeFramesPerShift",
      label: "Complete frames per shift",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stationNominalFramesPerHour:
        value.stationNominalFramesPerHour as readonly number[],
      parallelStationCounts: value.parallelStationCounts as readonly number[],
      productiveFractions: value.productiveFractions as readonly number[],
      shiftHours: value.shiftHours as number,
      commonSetupHours: value.commonSetupHours as number,
    }),
});
export const run = tool.execute;
export default tool;
