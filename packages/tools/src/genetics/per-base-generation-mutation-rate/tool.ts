import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly newMutations: number;
  readonly assayedBases: number;
  readonly generations: number;
  readonly minimumRate: number;
  readonly maximumRate: number;
}>;
export type Output = Readonly<{
  readonly mutationsPerBasePerGeneration: number;
  readonly withinRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.newMutations, "newMutations");
  count(input.assayedBases, "assayedBases", 1);
  count(input.generations, "generations", 1);
  nonnegative(input.minimumRate, "minimumRate");
  if (input.maximumRate < input.minimumRate)
    simpleError("maximumRate", "Ordered mutation-rate bounds required.");
  const mutationsPerBasePerGeneration =
    input.newMutations / (input.assayedBases * input.generations);
  return {
    mutationsPerBasePerGeneration,
    withinRange:
      mutationsPerBasePerGeneration >= input.minimumRate &&
      mutationsPerBasePerGeneration <= input.maximumRate,
  };
};
export const exampleInput = {
  newMutations: 10,
  assayedBases: 1000,
  generations: 2,
  minimumRate: 0.001,
  maximumRate: 0.01,
} satisfies Input;
export const exampleOutput = {
  mutationsPerBasePerGeneration: 0.005,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/per-base-generation-mutation-rate",
  title: "Per Base Generation Mutation Rate",
  description:
    "Normalize mutation observations by assayed base-generations and compare with caller-defined bounds.",
  inputs: [
    { id: "newMutations", label: "New mutations", kind: "integer" },
    { id: "assayedBases", label: "Assayed bases", kind: "integer" },
    { id: "generations", label: "Generations", kind: "integer" },
    { id: "minimumRate", label: "Minimum rate", kind: "number" },
    { id: "maximumRate", label: "Maximum rate", kind: "number" },
  ],
  outputs: [
    {
      id: "mutationsPerBasePerGeneration",
      label: "Mutations per base per generation",
      kind: "number",
    },
    { id: "withinRange", label: "Within range", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      newMutations: value.newMutations as number,
      assayedBases: value.assayedBases as number,
      generations: value.generations as number,
      minimumRate: value.minimumRate as number,
      maximumRate: value.maximumRate as number,
    }),
});
export const run = tool.execute;
export default tool;
