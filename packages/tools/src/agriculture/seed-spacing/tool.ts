import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly targetEstablishedPlantsPerHa: number;
  readonly rowSpacingM: number;
  readonly seedsPerDrop: number;
  readonly perSeedEstablishmentProbability: number;
}>;
export type Output = Readonly<{
  readonly requiredDropSpacingM: number;
  readonly requiredDropsPerHa: number;
  readonly requiredSownSeedsPerHa: number;
}>;
const inputFields = [
  {
    id: "targetEstablishedPlantsPerHa",
    label: "Target established plants per ha",
    kind: "number",
  },
  { id: "rowSpacingM", label: "Row spacing m", kind: "number" },
  { id: "seedsPerDrop", label: "Seeds per drop", kind: "integer" },
  {
    id: "perSeedEstablishmentProbability",
    label: "Per seed establishment probability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.targetEstablishedPlantsPerHa, "targetEstablishedPlantsPerHa");
  positive(input.rowSpacingM, "rowSpacingM");
  positive(input.seedsPerDrop, "seedsPerDrop");
  positive(
    input.perSeedEstablishmentProbability,
    "perSeedEstablishmentProbability",
  );
  fraction(
    input.perSeedEstablishmentProbability,
    "perSeedEstablishmentProbability",
  );
  count(input.seedsPerDrop, "seedsPerDrop");
  const requiredDropsPerHa =
    input.targetEstablishedPlantsPerHa /
    (input.seedsPerDrop * input.perSeedEstablishmentProbability);
  return {
    requiredDropSpacingM: 10000 / (requiredDropsPerHa * input.rowSpacingM),
    requiredDropsPerHa,
    requiredSownSeedsPerHa: requiredDropsPerHa * input.seedsPerDrop,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetEstablishedPlantsPerHa: 10000,
  rowSpacingM: 1,
  seedsPerDrop: 2,
  perSeedEstablishmentProbability: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredDropSpacingM: 1,
  requiredDropsPerHa: 10000,
  requiredSownSeedsPerHa: 20000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/seed-spacing",
  title: "Agriculture Seed Spacing",
  description:
    "Invert target expected field stand to multi-seed drop spacing with explicit per-seed establishment probability; counts represent expected plants (multiple plants per drop permitted), not probability of at least one plant or species guidance.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredDropSpacingM",
      label: "Required drop spacing m",
      kind: "number",
    },
    {
      id: "requiredDropsPerHa",
      label: "Required drops per ha",
      kind: "number",
    },
    {
      id: "requiredSownSeedsPerHa",
      label: "Required sown seeds per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetEstablishedPlantsPerHa:
        value.targetEstablishedPlantsPerHa as number,
      rowSpacingM: value.rowSpacingM as number,
      seedsPerDrop: value.seedsPerDrop as number,
      perSeedEstablishmentProbability:
        value.perSeedEstablishmentProbability as number,
    }),
});
export const run = tool.execute;
export default tool;
