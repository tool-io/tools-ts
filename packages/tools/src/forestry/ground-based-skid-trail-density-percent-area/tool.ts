import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly trailSegmentLengthsM: readonly number[];
  readonly trailSegmentWidthsM: readonly number[];
  readonly measuredOverlapAreaM2: number;
  readonly harvestAreaM2: number;
}>;
export type Output = Readonly<{
  readonly grossTrailStripAreaM2: number;
  readonly overlapCorrectedTrailAreaM2: number;
  readonly trailAreaOccupationPercent: number;
}>;
const inputFields = [
  {
    id: "trailSegmentLengthsM",
    label: "Trail segment lengths m",
    kind: "numberList",
  },
  {
    id: "trailSegmentWidthsM",
    label: "Trail segment widths m",
    kind: "numberList",
  },
  {
    id: "measuredOverlapAreaM2",
    label: "Measured overlap area m2",
    kind: "number",
  },
  { id: "harvestAreaM2", label: "Harvest area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.harvestAreaM2, "harvestAreaM2");
  input.trailSegmentLengthsM.forEach((v) =>
    nonnegative(v, "trailSegmentLengthsM"),
  );
  input.trailSegmentWidthsM.forEach((v) =>
    nonnegative(v, "trailSegmentWidthsM"),
  );
  nonnegative(input.measuredOverlapAreaM2, "measuredOverlapAreaM2");
  aligned(
    input.trailSegmentLengthsM,
    input.trailSegmentWidthsM,
    "trailSegmentLengthsM",
  );
  const grossTrailStripAreaM2 = input.trailSegmentLengthsM.reduce(
      (s, v, i) => s + v * input.trailSegmentWidthsM[i],
      0,
    ),
    overlapCorrectedTrailAreaM2 = nonnegative(
      grossTrailStripAreaM2 - input.measuredOverlapAreaM2,
      "measuredOverlapAreaM2",
    );
  fraction(overlapCorrectedTrailAreaM2 / input.harvestAreaM2, "harvestAreaM2");
  return {
    grossTrailStripAreaM2,
    overlapCorrectedTrailAreaM2,
    trailAreaOccupationPercent:
      (100 * overlapCorrectedTrailAreaM2) / input.harvestAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trailSegmentLengthsM: [100, 200],
  trailSegmentWidthsM: [2, 3],
  measuredOverlapAreaM2: 100,
  harvestAreaM2: 10000,
} satisfies Input;
export const exampleOutput = {
  grossTrailStripAreaM2: 800,
  overlapCorrectedTrailAreaM2: 700,
  trailAreaOccupationPercent: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/ground-based-skid-trail-density-percent-area",
  title: "Skid Trail Density Percent Area",
  description:
    "Account supplied trail strip areas and independently measured overlap before computing harvested-area occupation; no coordinate footprint construction or simple summed-overlap cover assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "grossTrailStripAreaM2",
      label: "Gross trail strip area m2",
      kind: "number",
    },
    {
      id: "overlapCorrectedTrailAreaM2",
      label: "Overlap corrected trail area m2",
      kind: "number",
    },
    {
      id: "trailAreaOccupationPercent",
      label: "Trail area occupation percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trailSegmentLengthsM: value.trailSegmentLengthsM as readonly number[],
      trailSegmentWidthsM: value.trailSegmentWidthsM as readonly number[],
      measuredOverlapAreaM2: value.measuredOverlapAreaM2 as number,
      harvestAreaM2: value.harvestAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
