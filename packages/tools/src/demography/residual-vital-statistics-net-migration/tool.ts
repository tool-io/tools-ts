import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResidualVitalStatisticsNetMigrationInput = {
  readonly populationStart: number;
  readonly populationEnd: number;
  readonly births: number;
  readonly deaths: number;
};

export type ResidualVitalStatisticsNetMigrationOutput = {
  readonly netMigration: number;
};

export const calculateResidualVitalStatisticsNetMigration = (
  input: ResidualVitalStatisticsNetMigrationInput,
): ResidualVitalStatisticsNetMigrationOutput => {
  for (const key of [
    "populationStart",
    "populationEnd",
    "births",
    "deaths",
  ] as const)
    if (!((input[key] as number) >= 0))
      simpleError(
        key,
        "Populations and vital events must be non-negative.",
        "invalid_count",
      );
  return {
    netMigration:
      input.populationEnd - input.populationStart - input.births + input.deaths,
  };
};

export const residualVitalStatisticsNetMigrationExample = {
  input: {
    populationStart: 100000,
    populationEnd: 108000,
    births: 2400,
    deaths: 1400,
  },
  output: { netMigration: 7000 },
} satisfies ToolExample<
  ResidualVitalStatisticsNetMigrationInput,
  ResidualVitalStatisticsNetMigrationOutput
>;

export const residualVitalStatisticsNetMigrationTool = createSimpleTool({
  id: "demography/residual-vital-statistics-net-migration",
  title: "Residual Vital Statistics Net Migration",
  description:
    "Estimate net migration by the vital-statistics residual method as P2 - P1 - B + D over the intercensal period.",
  inputs: [
    {
      description: "Population at the start of the period.",
      id: "populationStart",
      kind: "number",
      label: "P1",
      minimum: 0,
    },
    {
      description: "Population at the end of the period.",
      id: "populationEnd",
      kind: "number",
      label: "P2",
      minimum: 0,
    },
    {
      description: "Births registered during the period.",
      id: "births",
      kind: "number",
      label: "Births",
      minimum: 0,
    },
    {
      description: "Deaths registered during the period.",
      id: "deaths",
      kind: "number",
      label: "Deaths",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Estimated net migration; negative values signal net emigration.",
      id: "netMigration",
      kind: "number",
      label: "NM",
    },
  ],
  calculate: (input) =>
    calculateResidualVitalStatisticsNetMigration(
      input as unknown as ResidualVitalStatisticsNetMigrationInput,
    ),
});

export const runResidualVitalStatisticsNetMigration =
  residualVitalStatisticsNetMigrationTool.execute;
export default residualVitalStatisticsNetMigrationTool;
