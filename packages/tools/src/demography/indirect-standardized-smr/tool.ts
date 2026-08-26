import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IndirectStandardizedSmrInput = {
  readonly standardRates: readonly number[];
  readonly studyPopulationByAge: readonly number[];
  readonly observedDeathsTotal: number;
  readonly standardCrudeRate: number;
};

export type IndirectStandardizedSmrOutput = {
  readonly expectedDeaths: number;
  readonly smr: number;
  readonly crudeMortalityRate: number;
  readonly indirectlyStandardizedRate: number;
};

export const calculateIndirectStandardizedSmr = (
  input: IndirectStandardizedSmrInput,
): IndirectStandardizedSmrOutput => {
  if (input.standardRates.length === 0)
    simpleError(
      "standardRates",
      "Provide at least one standard age-specific rate.",
      "invalid_list",
    );
  for (const rate of input.standardRates)
    if (!(typeof rate === "number" && Number.isFinite(rate) && rate >= 0))
      simpleError(
        "standardRates",
        "Standard rates must be finite and non-negative.",
        "invalid_list",
      );
  if (input.studyPopulationByAge.length !== input.standardRates.length)
    simpleError(
      "studyPopulationByAge",
      "Study population counts must match the standard rates one to one.",
      "invalid_list",
    );
  let populationTotal = 0;
  for (const count of input.studyPopulationByAge) {
    if (!(typeof count === "number" && Number.isFinite(count) && count >= 0))
      simpleError(
        "studyPopulationByAge",
        "Study population counts must be finite and non-negative.",
        "invalid_list",
      );
    populationTotal += count;
  }
  if (!(populationTotal > 0))
    simpleError(
      "studyPopulationByAge",
      "The study population must sum to a positive total.",
      "invalid_list",
    );
  if (!(
    typeof input.observedDeathsTotal === "number" &&
    Number.isFinite(input.observedDeathsTotal) &&
    input.observedDeathsTotal >= 0
  ))
    simpleError(
      "observedDeathsTotal",
      "Observed deaths must be finite and non-negative.",
      "invalid_deaths",
    );
  if (!(
    Number.isFinite(input.standardCrudeRate) && input.standardCrudeRate >= 0
  ))
    simpleError(
      "standardCrudeRate",
      "The crude rate of the standard population must be finite and non-negative.",
      "invalid_rate",
    );
  let expectedDeaths = 0;
  for (let i = 0; i < input.standardRates.length; i += 1)
    expectedDeaths += input.standardRates[i]! * input.studyPopulationByAge[i]!;
  if (!(expectedDeaths > 0))
    simpleError(
      "standardRates",
      "Expected deaths are zero; supply positive rates against populated age groups.",
      "invalid_rates",
    );
  const smr = input.observedDeathsTotal / expectedDeaths;
  const crudeMortalityRate = input.observedDeathsTotal / populationTotal;
  return {
    expectedDeaths,
    smr,
    crudeMortalityRate,
    indirectlyStandardizedRate: input.standardCrudeRate * smr,
  };
};

export const indirectStandardizedSmrExample = {
  input: {
    standardRates: [0.01, 0.02],
    studyPopulationByAge: [500, 500],
    observedDeathsTotal: 12,
    standardCrudeRate: 0.015,
  },
  output: {
    expectedDeaths: 15,
    smr: 0.8,
    crudeMortalityRate: 0.012,
    indirectlyStandardizedRate: 0.012,
  },
} satisfies ToolExample<
  IndirectStandardizedSmrInput,
  IndirectStandardizedSmrOutput
>;

export const indirectStandardizedSmrTool = createSimpleTool({
  id: "demography/indirect-standardized-smr",
  title: "Indirect Standardized SMR",
  description:
    "Apply indirect standardization: compute expected deaths from standard age-specific rates and study exposure, divide observed by expected deaths for the SMR, and multiply that ratio by the standard population's crude rate to obtain an indirectly standardized rate.",
  inputs: [
    {
      description:
        "Reference (standard) population age-specific rates in events per person-year.",
      id: "standardRates",
      kind: "numberList",
      label: "Standard rates",
    },
    {
      description: "Study population exposed by the same age groups.",
      id: "studyPopulationByAge",
      kind: "numberList",
      label: "Study population",
    },
    {
      description:
        "Total deaths observed in the study population over the period.",
      id: "observedDeathsTotal",
      kind: "number",
      label: "Observed deaths",
      minimum: 0,
    },
    {
      description:
        "Crude event rate in the standard population, expressed in the same units as the age-specific rates.",
      id: "standardCrudeRate",
      kind: "number",
      label: "Standard crude rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Expected deaths from applying standard rates to study exposure.",
      id: "expectedDeaths",
      kind: "number",
      label: "Expected",
    },
    {
      description:
        "Standardized mortality ratio, observed divided by expected deaths.",
      id: "smr",
      kind: "number",
      label: "SMR",
    },
    {
      description: "Crude death rate of the study population per person-year.",
      id: "crudeMortalityRate",
      kind: "number",
      label: "Crude rate",
    },
    {
      description:
        "Indirectly standardized rate: the standard population's crude rate multiplied by the SMR.",
      id: "indirectlyStandardizedRate",
      kind: "number",
      label: "Standardized rate",
    },
  ],
  calculate: (input) =>
    calculateIndirectStandardizedSmr(
      input as unknown as IndirectStandardizedSmrInput,
    ),
});

export const runIndirectStandardizedSmr = indirectStandardizedSmrTool.execute;
export default indirectStandardizedSmrTool;
