import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetViableFryCount: number;
  readonly eggsPerSpawningFemale: number;
  readonly spawningFemaleFraction: number;
  readonly eggToFrySurvival: number;
  readonly malesPerFemale: number;
}>;
export type Output = Readonly<{
  readonly requiredFemaleCount: number;
  readonly requiredMaleCount: number;
  readonly totalBroodstockCount: number;
}>;
const inputFields = [
  {
    id: "targetViableFryCount",
    label: "Target viable fry count",
    kind: "integer",
  },
  {
    id: "eggsPerSpawningFemale",
    label: "Eggs per spawning female",
    kind: "integer",
  },
  {
    id: "spawningFemaleFraction",
    label: "Spawning female fraction",
    kind: "number",
  },
  { id: "eggToFrySurvival", label: "Egg to fry survival", kind: "number" },
  { id: "malesPerFemale", label: "Males per female", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.eggsPerSpawningFemale, "eggsPerSpawningFemale");
  positive(input.spawningFemaleFraction, "spawningFemaleFraction");
  positive(input.eggToFrySurvival, "eggToFrySurvival");
  nonnegative(input.malesPerFemale, "malesPerFemale");
  fraction(input.spawningFemaleFraction, "spawningFemaleFraction");
  fraction(input.eggToFrySurvival, "eggToFrySurvival");
  count(input.targetViableFryCount, "targetViableFryCount");
  count(input.eggsPerSpawningFemale, "eggsPerSpawningFemale");
  const requiredFemaleCount = count(
      Math.ceil(
        input.targetViableFryCount /
          (input.eggsPerSpawningFemale *
            input.spawningFemaleFraction *
            input.eggToFrySurvival),
      ),
      "requiredFemaleCount",
    ),
    requiredMaleCount = count(
      Math.ceil(requiredFemaleCount * input.malesPerFemale),
      "requiredMaleCount",
    );
  return {
    requiredFemaleCount,
    requiredMaleCount,
    totalBroodstockCount: count(
      requiredFemaleCount + requiredMaleCount,
      "totalBroodstockCount",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetViableFryCount: 100000,
  eggsPerSpawningFemale: 1000,
  spawningFemaleFraction: 0.5,
  eggToFrySurvival: 0.8,
  malesPerFemale: 0.2,
} satisfies Input;
export const exampleOutput = {
  requiredFemaleCount: 250,
  requiredMaleCount: 50,
  totalBroodstockCount: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/broodstock-requirement",
  title: "Broodstock Requirement",
  description:
    "Plan broodstock counts from supplied fecundity, spawning participation and fry survival; expected productivity is not genetic, welfare or spawn-success certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredFemaleCount",
      label: "Required female count",
      kind: "number",
    },
    { id: "requiredMaleCount", label: "Required male count", kind: "number" },
    {
      id: "totalBroodstockCount",
      label: "Total broodstock count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetViableFryCount: value.targetViableFryCount as number,
      eggsPerSpawningFemale: value.eggsPerSpawningFemale as number,
      spawningFemaleFraction: value.spawningFemaleFraction as number,
      eggToFrySurvival: value.eggToFrySurvival as number,
      malesPerFemale: value.malesPerFemale as number,
    }),
});
export const run = tool.execute;
export default tool;
