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
  readonly sampleEggCounts: readonly number[];
  readonly sampleGrossMassesGrams: readonly number[];
  readonly sampleTaresGrams: readonly number[];
  readonly seedLotNetMassGrams: number;
}>;
export type Output = Readonly<{
  readonly calibratedEggsPerGram: number;
  readonly estimatedLotEggCount: number;
}>;
const inputFields = [
  { id: "sampleEggCounts", label: "Sample egg counts", kind: "numberList" },
  {
    id: "sampleGrossMassesGrams",
    label: "Sample gross masses grams",
    kind: "numberList",
  },
  { id: "sampleTaresGrams", label: "Sample tares grams", kind: "numberList" },
  {
    id: "seedLotNetMassGrams",
    label: "Seed lot net mass grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampleGrossMassesGrams.forEach((v) =>
    nonnegative(v, "sampleGrossMassesGrams"),
  );
  input.sampleTaresGrams.forEach((v) => nonnegative(v, "sampleTaresGrams"));
  nonnegative(input.seedLotNetMassGrams, "seedLotNetMassGrams");
  input.sampleEggCounts.forEach((v) => count(v, "sampleEggCounts"));
  aligned(
    input.sampleEggCounts,
    input.sampleGrossMassesGrams,
    "sampleEggCounts",
  );
  aligned(input.sampleEggCounts, input.sampleTaresGrams, "sampleEggCounts");
  const mass = input.sampleGrossMassesGrams.reduce(
      (s, v, i) =>
        s + positive(v - input.sampleTaresGrams[i], "sampleTaresGrams"),
      0,
    ),
    calibratedEggsPerGram =
      positive(
        input.sampleEggCounts.reduce((a, b) => a + b, 0),
        "sampleEggCounts",
      ) / mass;
  return {
    calibratedEggsPerGram,
    estimatedLotEggCount: calibratedEggsPerGram * input.seedLotNetMassGrams,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleEggCounts: [100, 300],
  sampleGrossMassesGrams: [0.15, 0.35],
  sampleTaresGrams: [0.05, 0.05],
  seedLotNetMassGrams: 10,
} satisfies Input;
export const exampleOutput = {
  calibratedEggsPerGram: 1000,
  estimatedLotEggCount: 10000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/eggs-per-gram-silkworm-seed",
  title: "Eggs Per Gram Silkworm Seed",
  description:
    "Estimate a seed-lot egg count using pooled tare-corrected count/mass samples; no fixed eggs-per-gram reference or hatchability assumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedEggsPerGram",
      label: "Calibrated eggs per gram",
      kind: "number",
    },
    {
      id: "estimatedLotEggCount",
      label: "Estimated lot egg count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleEggCounts: value.sampleEggCounts as readonly number[],
      sampleGrossMassesGrams: value.sampleGrossMassesGrams as readonly number[],
      sampleTaresGrams: value.sampleTaresGrams as readonly number[],
      seedLotNetMassGrams: value.seedLotNetMassGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
