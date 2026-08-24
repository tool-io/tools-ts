import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NetMigrationCensusSurvivalMethodInput = {
  readonly populationEnd: number;
  readonly populationStart: number;
  readonly survivalRatio: number;
};

export type NetMigrationCensusSurvivalMethodOutput = {
  readonly netMigration: number;
};

export const netMigrationCensusSurvivalMethodExample = {
  input: {
    populationEnd: 14000,
    populationStart: 12000,
    survivalRatio: 0.85,
  },
  output: {
    netMigration: 3800,
  },
} satisfies ToolExample<
  NetMigrationCensusSurvivalMethodInput,
  NetMigrationCensusSurvivalMethodOutput
>;

export const calculateNetMigrationCensusSurvival = (
  input: NetMigrationCensusSurvivalMethodInput,
): NetMigrationCensusSurvivalMethodOutput => {
  if (
    !Number.isFinite(input.populationStart) ||
    !Number.isFinite(input.populationEnd) ||
    input.populationStart < 0 ||
    input.populationEnd < 0
  )
    simpleError(
      "populationStart",
      "Both census cohort counts must be finite nonnegative numbers.",
      "invalid_value",
    );
  if (!Number.isFinite(input.survivalRatio) || input.survivalRatio < 0)
    simpleError(
      "survivalRatio",
      "The survival ratio cannot be negative.",
      "invalid_value",
    );
  const netMigration =
    input.populationEnd - input.populationStart * input.survivalRatio;
  if (!Number.isFinite(netMigration))
    simpleError(
      "populationStart",
      "Net migration is outside the finite numeric range.",
      "numeric_range",
    );
  return { netMigration };
};

export const netMigrationCensusSurvivalMethodTool = createSimpleTool({
  calculate: (input) =>
    calculateNetMigrationCensusSurvival({
      populationEnd: input.populationEnd as number,
      populationStart: input.populationStart as number,
      survivalRatio: input.survivalRatio as number,
    }),
  description:
    "Isolate net migration as the census count minus the survivors projected forward from the earlier census.",
  id: "sociology/net-migration-census-survival-method",
  inputs: [
    {
      description: "Cohort counted in the later census.",
      id: "populationEnd",
      kind: "number",
      label: "Later census",
      minimum: 0,
    },
    {
      description: "Same cohort counted in the earlier census.",
      id: "populationStart",
      kind: "number",
      label: "Earlier census",
      minimum: 0,
    },
    {
      description: "Intercensal survival ratio applied to the starting cohort.",
      id: "survivalRatio",
      kind: "number",
      label: "Survival ratio",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Net migration implied by the census difference; negative means net emigration.",
      id: "netMigration",
      kind: "number",
      label: "Net migration",
    },
  ],
  title: "Net Migration Census Survival Method Calculator",
});
export const runNetMigrationCensusSurvivalMethod =
  netMigrationCensusSurvivalMethodTool.execute;
export default netMigrationCensusSurvivalMethodTool;
