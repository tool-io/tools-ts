import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SevereMaterialDeprivationRateEuInput = {
  readonly severelyDeprivedPersons: number;
  readonly totalPopulation: number;
};

export type SevereMaterialDeprivationRateEuOutput = {
  readonly deprivationRatePercent: number;
};

export const severeMaterialDeprivationRateEuExample = {
  input: {
    severelyDeprivedPersons: 450,
    totalPopulation: 10000,
  },
  output: {
    deprivationRatePercent: 4.5,
  },
} satisfies ToolExample<
  SevereMaterialDeprivationRateEuInput,
  SevereMaterialDeprivationRateEuOutput
>;

export const calculateSevereMaterialDeprivation = (
  input: SevereMaterialDeprivationRateEuInput,
): SevereMaterialDeprivationRateEuOutput => {
  if (!Number.isFinite(input.totalPopulation) || input.totalPopulation <= 0)
    simpleError(
      "totalPopulation",
      "The surveyed population must be positive.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.severelyDeprivedPersons) ||
    input.severelyDeprivedPersons < 0 ||
    input.severelyDeprivedPersons > input.totalPopulation
  )
    simpleError(
      "severelyDeprivedPersons",
      "Deprived persons cannot exceed the surveyed population.",
      "invalid_value",
    );
  return {
    deprivationRatePercent:
      (input.severelyDeprivedPersons / input.totalPopulation) * 100,
  };
};

export const severeMaterialDeprivationRateEuTool = createSimpleTool({
  calculate: (input) =>
    calculateSevereMaterialDeprivation({
      severelyDeprivedPersons: input.severelyDeprivedPersons as number,
      totalPopulation: input.totalPopulation as number,
    }),
  description:
    "Compute the EU severe material deprivation rate from the deprived count and surveyed population.",
  id: "sociology/severe-material-deprivation-rate-eu",
  inputs: [
    {
      description:
        "Persons lacking at least the required number of deprivation items.",
      id: "severelyDeprivedPersons",
      kind: "number",
      label: "Severely deprived",
      minimum: 0,
    },
    {
      description: "Total persons covered by the survey.",
      id: "totalPopulation",
      kind: "number",
      label: "Surveyed population",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Share of the population severely deprived.",
      id: "deprivationRatePercent",
      kind: "number",
      label: "Deprivation rate",
      unit: "%",
    },
  ],
  title: "EU Severe Material Deprivation Rate Calculator",
});
export const runSevereMaterialDeprivationRateEu =
  severeMaterialDeprivationRateEuTool.execute;
export default severeMaterialDeprivationRateEuTool;
