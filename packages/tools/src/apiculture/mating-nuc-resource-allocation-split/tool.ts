import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly availableBroodFrames: number;
  readonly broodFramesPerNuc: number;
  readonly availableBeeMassKg: number;
  readonly beeMassKgPerNuc: number;
  readonly availableFeedKg: number;
  readonly feedKgPerNuc: number;
  readonly availableQueens: number;
}>;
export type Output = Readonly<{
  readonly maximumResourceSupportedNucs: number;
  readonly unusedBroodFrames: number;
  readonly unusedBeeMassKg: number;
  readonly unusedFeedKg: number;
  readonly unusedQueens: number;
}>;
const inputFields = [
  {
    id: "availableBroodFrames",
    label: "Available brood frames",
    kind: "integer",
  },
  { id: "broodFramesPerNuc", label: "Brood frames per nuc", kind: "integer" },
  { id: "availableBeeMassKg", label: "Available bee mass kg", kind: "number" },
  { id: "beeMassKgPerNuc", label: "Bee mass kg per nuc", kind: "number" },
  { id: "availableFeedKg", label: "Available feed kg", kind: "number" },
  { id: "feedKgPerNuc", label: "Feed kg per nuc", kind: "number" },
  { id: "availableQueens", label: "Available queens", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.broodFramesPerNuc, "broodFramesPerNuc");
  positive(input.beeMassKgPerNuc, "beeMassKgPerNuc");
  positive(input.feedKgPerNuc, "feedKgPerNuc");
  nonnegative(input.availableBeeMassKg, "availableBeeMassKg");
  nonnegative(input.availableFeedKg, "availableFeedKg");
  count(input.availableBroodFrames, "availableBroodFrames");
  count(input.broodFramesPerNuc, "broodFramesPerNuc");
  count(input.availableQueens, "availableQueens");
  const maximumResourceSupportedNucs = Math.min(
    Math.floor(input.availableBroodFrames / input.broodFramesPerNuc),
    Math.floor(input.availableBeeMassKg / input.beeMassKgPerNuc),
    Math.floor(input.availableFeedKg / input.feedKgPerNuc),
    input.availableQueens,
  );
  count(maximumResourceSupportedNucs, "maximumResourceSupportedNucs");
  return {
    maximumResourceSupportedNucs,
    unusedBroodFrames:
      input.availableBroodFrames -
      maximumResourceSupportedNucs * input.broodFramesPerNuc,
    unusedBeeMassKg:
      input.availableBeeMassKg -
      maximumResourceSupportedNucs * input.beeMassKgPerNuc,
    unusedFeedKg:
      input.availableFeedKg - maximumResourceSupportedNucs * input.feedKgPerNuc,
    unusedQueens: input.availableQueens - maximumResourceSupportedNucs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  availableBroodFrames: 10,
  broodFramesPerNuc: 2,
  availableBeeMassKg: 4,
  beeMassKgPerNuc: 1,
  availableFeedKg: 15,
  feedKgPerNuc: 3,
  availableQueens: 6,
} satisfies Input;
export const exampleOutput = {
  maximumResourceSupportedNucs: 4,
  unusedBroodFrames: 2,
  unusedBeeMassKg: 0,
  unusedFeedKg: 3,
  unusedQueens: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/mating-nuc-resource-allocation-split",
  title: "Mating Nuc Resource Allocation Split",
  description:
    "Plan whole mating nucs against disjoint brood, bee, feed and queen resources with caller per-nuc needs; not a biological adequacy or colony-splitting recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumResourceSupportedNucs",
      label: "Maximum resource supported nucs",
      kind: "number",
    },
    { id: "unusedBroodFrames", label: "Unused brood frames", kind: "number" },
    { id: "unusedBeeMassKg", label: "Unused bee mass kg", kind: "number" },
    { id: "unusedFeedKg", label: "Unused feed kg", kind: "number" },
    { id: "unusedQueens", label: "Unused queens", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      availableBroodFrames: value.availableBroodFrames as number,
      broodFramesPerNuc: value.broodFramesPerNuc as number,
      availableBeeMassKg: value.availableBeeMassKg as number,
      beeMassKgPerNuc: value.beeMassKgPerNuc as number,
      availableFeedKg: value.availableFeedKg as number,
      feedKgPerNuc: value.feedKgPerNuc as number,
      availableQueens: value.availableQueens as number,
    }),
});
export const run = tool.execute;
export default tool;
