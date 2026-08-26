import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PerinatalRateDefinitionLookupInput = {
  readonly lateFetalDeaths: number;
  readonly earlyNeonatalDeaths: number;
  readonly liveBirths: number;
};

export type PerinatalRateDefinitionLookupOutput = {
  readonly perinatalMortalityRate: number;
  readonly definitionNote: string;
};

export const calculatePerinatalRateDefinitionLookup = (
  input: PerinatalRateDefinitionLookupInput,
): PerinatalRateDefinitionLookupOutput => {
  if (!(input.lateFetalDeaths >= 0))
    simpleError(
      "lateFetalDeaths",
      "Late fetal deaths must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.earlyNeonatalDeaths >= 0))
    simpleError(
      "earlyNeonatalDeaths",
      "Early neonatal deaths must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.liveBirths > 0))
    simpleError(
      "liveBirths",
      "Live births must be greater than zero.",
      "invalid_births",
    );
  return {
    perinatalMortalityRate:
      ((input.lateFetalDeaths + input.earlyNeonatalDeaths) /
        (input.liveBirths + input.lateFetalDeaths)) *
      1000,
    definitionNote:
      "WHO convention: late fetal deaths (22 or more completed weeks of gestation) plus early neonatal deaths (under 7 days) per 1000 total births.",
  };
};

export const perinatalRateDefinitionLookupExample = {
  input: { lateFetalDeaths: 350, earlyNeonatalDeaths: 650, liveBirths: 100000 },
  output: {
    perinatalMortalityRate: 9.965122072745391,
    definitionNote:
      "WHO convention: late fetal deaths (22 or more completed weeks of gestation) plus early neonatal deaths (under 7 days) per 1000 total births.",
  },
} satisfies ToolExample<
  PerinatalRateDefinitionLookupInput,
  PerinatalRateDefinitionLookupOutput
>;

export const perinatalRateDefinitionLookupTool = createSimpleTool({
  id: "demography/perinatal-rate-definition-lookup",
  title: "Perinatal Rate Definition Lookup",
  description:
    "Compute the perinatal mortality rate as late fetal plus early neonatal deaths per one thousand total births and state the WHO definitional convention used.",
  inputs: [
    {
      description:
        "Stillbirths at or beyond the gestational threshold (28th week convention).",
      id: "lateFetalDeaths",
      kind: "number",
      label: "Fetal deaths",
      minimum: 0,
    },
    {
      description: "Deaths of live-born children under 7 days.",
      id: "earlyNeonatalDeaths",
      kind: "number",
      label: "Early neonatal",
      minimum: 0,
    },
    {
      description: "Live births in the same period.",
      id: "liveBirths",
      kind: "number",
      label: "Live births",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Perinatal deaths per 1000 total births.",
      id: "perinatalMortalityRate",
      kind: "number",
      label: "PM rate",
    },
    {
      description: "Definitional convention applied.",
      id: "definitionNote",
      kind: "string",
      label: "Definition",
    },
  ],
  calculate: (input) =>
    calculatePerinatalRateDefinitionLookup(
      input as unknown as PerinatalRateDefinitionLookupInput,
    ),
});

export const runPerinatalRateDefinitionLookup =
  perinatalRateDefinitionLookupTool.execute;
export default perinatalRateDefinitionLookupTool;
