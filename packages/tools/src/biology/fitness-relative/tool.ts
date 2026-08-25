import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fitnessRelativeExample = {
  input: { maxSurvivedInPopulation: 60, survivedOffspring: 45 },
  output: { relativeFitnessW: 0.75 },
} satisfies ToolExample<
  {
    readonly maxSurvivedInPopulation: number;
    readonly survivedOffspring: number;
  },
  { readonly relativeFitnessW: number }
>;

export const fitnessRelativeTool = createSimpleTool({
  id: "biology/fitness-relative",
  title: "Relative Fitness",
  description:
    "Compute relative fitness w = survived offspring / maximum survived offspring in the population.",
  inputs: [
    {
      id: "survivedOffspring",
      kind: "number",
      label: "Survived offspring",
      minimum: 0,
    },
    {
      id: "maxSurvivedInPopulation",
      kind: "number",
      label: "Maximum survived in population",
    },
  ],
  outputs: [
    {
      id: "relativeFitnessW",
      kind: "number",
      label: "Relative fitness w",
    },
  ],
  calculate: (input) => {
    const survivedOffspring = input.survivedOffspring as number;
    const maxSurvivedInPopulation = input.maxSurvivedInPopulation as number;
    if (!(maxSurvivedInPopulation > 0))
      simpleError(
        "maxSurvivedInPopulation",
        "Maximum survived must be positive.",
      );
    if (survivedOffspring > maxSurvivedInPopulation)
      simpleError(
        "survivedOffspring",
        "Survived offspring must not exceed the population maximum.",
        "invalid_fitness",
      );
    return { relativeFitnessW: survivedOffspring / maxSurvivedInPopulation };
  },
});
export const runFitnessRelative = fitnessRelativeTool.execute;
export default fitnessRelativeTool;
