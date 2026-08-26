import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const migrationRateExample = {
  input: { effectivePopulationSizeInt: 500, migrantsPerGeneration: 10 },
  output: { migrationRateM: 0.02 },
} satisfies ToolExample<
  {
    readonly effectivePopulationSizeInt: number;
    readonly migrantsPerGeneration: number;
  },
  { readonly migrationRateM: number }
>;

export const migrationRateTool = createSimpleTool({
  id: "biology/migration-rate",
  title: "Migration Rate m",
  description:
    "Compute the migration rate m = migrants per generation / effective population size.",
  inputs: [
    {
      id: "migrantsPerGeneration",
      kind: "number",
      label: "Migrants per generation",
      minimum: 0,
    },
    {
      id: "effectivePopulationSizeInt",
      kind: "integer",
      label: "Effective population size Ne",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "migrationRateM",
      kind: "number",
      label: "Migration rate m",
    },
  ],
  calculate: (input) => ({
    migrationRateM:
      (input.migrantsPerGeneration as number) /
      (input.effectivePopulationSizeInt as number),
  }),
});
export const runMigrationRate = migrationRateTool.execute;
export default migrationRateTool;
