import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly streamCrossingCounts: readonly number[];
  readonly assessedRoadLengthsKm: readonly number[];
  readonly unassessedRoadLengthKm: number;
}>;
export type Output = Readonly<{
  readonly assessedCrossingDensityPerRoadKm: number;
  readonly assessedRoadCoverageFraction: number;
  readonly totalCrossingsOnAssessedRoads: number;
}>;
const inputFields = [
  {
    id: "streamCrossingCounts",
    label: "Stream crossing counts",
    kind: "numberList",
  },
  {
    id: "assessedRoadLengthsKm",
    label: "Assessed road lengths km",
    kind: "numberList",
  },
  {
    id: "unassessedRoadLengthKm",
    label: "Unassessed road length km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.assessedRoadLengthsKm.forEach((v) =>
    positive(v, "assessedRoadLengthsKm"),
  );
  nonnegative(input.unassessedRoadLengthKm, "unassessedRoadLengthKm");
  input.streamCrossingCounts.forEach((v) => count(v, "streamCrossingCounts"));
  aligned(
    input.streamCrossingCounts,
    input.assessedRoadLengthsKm,
    "streamCrossingCounts",
  );
  const length = input.assessedRoadLengthsKm.reduce((a, b) => a + b, 0),
    totalCrossingsOnAssessedRoads = input.streamCrossingCounts.reduce(
      (a, b) => a + b,
      0,
    );
  return {
    assessedCrossingDensityPerRoadKm: totalCrossingsOnAssessedRoads / length,
    assessedRoadCoverageFraction:
      length / (length + input.unassessedRoadLengthKm),
    totalCrossingsOnAssessedRoads,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  streamCrossingCounts: [2, 6],
  assessedRoadLengthsKm: [1, 3],
  unassessedRoadLengthKm: 1,
} satisfies Input;
export const exampleOutput = {
  assessedCrossingDensityPerRoadKm: 2,
  assessedRoadCoverageFraction: 0.8,
  totalCrossingsOnAssessedRoads: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/stream-crossing-density-per-km-road",
  title: "Stream Crossing Density Per Road-km",
  description:
    "Summarize observed crossing density on assessed road exposure with unassessed coverage retained; no invented crossings, mapped intersections or drainage-impact rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "assessedCrossingDensityPerRoadKm",
      label: "Assessed crossing density per road km",
      kind: "number",
    },
    {
      id: "assessedRoadCoverageFraction",
      label: "Assessed road coverage fraction",
      kind: "number",
    },
    {
      id: "totalCrossingsOnAssessedRoads",
      label: "Total crossings on assessed roads",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      streamCrossingCounts: value.streamCrossingCounts as readonly number[],
      assessedRoadLengthsKm: value.assessedRoadLengthsKm as readonly number[],
      unassessedRoadLengthKm: value.unassessedRoadLengthKm as number,
    }),
});
export const run = tool.execute;
export default tool;
