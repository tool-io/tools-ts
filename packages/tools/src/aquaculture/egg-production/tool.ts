import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly femaleCountsByCohort: readonly number[];
  readonly eggsPerSpawningFemale: readonly number[];
  readonly spawningFractions: readonly number[];
  readonly viableEggFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly expectedGrossEggsByCohort: readonly number[];
  readonly expectedViableEggsByCohort: readonly number[];
  readonly totalExpectedViableEggs: number;
}>;
const inputFields = [
  {
    id: "femaleCountsByCohort",
    label: "Female counts by cohort",
    kind: "numberList",
  },
  {
    id: "eggsPerSpawningFemale",
    label: "Eggs per spawning female",
    kind: "numberList",
  },
  { id: "spawningFractions", label: "Spawning fractions", kind: "numberList" },
  {
    id: "viableEggFractions",
    label: "Viable egg fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.spawningFractions.forEach((v) => fraction(v, "spawningFractions"));
  input.viableEggFractions.forEach((v) => fraction(v, "viableEggFractions"));
  input.femaleCountsByCohort.forEach((v) => count(v, "femaleCountsByCohort"));
  input.eggsPerSpawningFemale.forEach((v) => count(v, "eggsPerSpawningFemale"));
  aligned(
    input.femaleCountsByCohort,
    input.eggsPerSpawningFemale,
    "femaleCountsByCohort",
  );
  aligned(
    input.femaleCountsByCohort,
    input.spawningFractions,
    "femaleCountsByCohort",
  );
  aligned(
    input.femaleCountsByCohort,
    input.viableEggFractions,
    "femaleCountsByCohort",
  );
  const expectedGrossEggsByCohort = input.femaleCountsByCohort.map(
      (v, i) => v * input.eggsPerSpawningFemale[i] * input.spawningFractions[i],
    ),
    expectedViableEggsByCohort = expectedGrossEggsByCohort.map(
      (v, i) => v * input.viableEggFractions[i],
    );
  return {
    expectedGrossEggsByCohort,
    expectedViableEggsByCohort,
    totalExpectedViableEggs: expectedViableEggsByCohort.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  femaleCountsByCohort: [2, 3],
  eggsPerSpawningFemale: [1000, 2000],
  spawningFractions: [0.5, 1],
  viableEggFractions: [0.8, 0.5],
} satisfies Input;
export const exampleOutput = {
  expectedGrossEggsByCohort: [1000, 6000],
  expectedViableEggsByCohort: [800, 3000],
  totalExpectedViableEggs: 3800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/egg-production",
  title: "Egg Production Estimate",
  description:
    "Estimate cohort-specific gross and viable eggs with heterogeneous spawning/fecundity inputs; distinct from inverse broodstock planning or hatch-rate ratios.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedGrossEggsByCohort",
      label: "Expected gross eggs by cohort",
      kind: "numberList",
    },
    {
      id: "expectedViableEggsByCohort",
      label: "Expected viable eggs by cohort",
      kind: "numberList",
    },
    {
      id: "totalExpectedViableEggs",
      label: "Total expected viable eggs",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      femaleCountsByCohort: value.femaleCountsByCohort as readonly number[],
      eggsPerSpawningFemale: value.eggsPerSpawningFemale as readonly number[],
      spawningFractions: value.spawningFractions as readonly number[],
      viableEggFractions: value.viableEggFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
