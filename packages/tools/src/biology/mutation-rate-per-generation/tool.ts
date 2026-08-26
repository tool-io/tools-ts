import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const mutationRatePerGenerationExample = {
  input: {
    generationsInt: 100,
    newMutationsCount: 5,
    populationSizeInt: 10000,
  },
  output: { mutationRatePerGeneration: 0.000005 },
} satisfies ToolExample<
  {
    readonly generationsInt: number;
    readonly newMutationsCount: number;
    readonly populationSizeInt: number;
  },
  { readonly mutationRatePerGeneration: number }
>;

export const mutationRatePerGenerationTool = createSimpleTool({
  id: "biology/mutation-rate-per-generation",
  title: "Mutation Rate",
  description:
    "Compute the mutation rate per generation as new mutations / (population size x generations).",
  inputs: [
    {
      id: "newMutationsCount",
      kind: "number",
      label: "New mutations",
      minimum: 0,
    },
    {
      id: "populationSizeInt",
      kind: "integer",
      label: "Population size",
      minimum: 1,
    },
    {
      id: "generationsInt",
      kind: "integer",
      label: "Generations",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "mutationRatePerGeneration",
      kind: "number",
      label: "Mutation rate per generation",
    },
  ],
  calculate: (input) => ({
    mutationRatePerGeneration:
      (input.newMutationsCount as number) /
      ((input.populationSizeInt as number) * (input.generationsInt as number)),
  }),
});
export const runMutationRatePerGeneration =
  mutationRatePerGenerationTool.execute;
export default mutationRatePerGenerationTool;
