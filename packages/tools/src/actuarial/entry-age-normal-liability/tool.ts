import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EntryAgeNormalLiabilityInput = {
  readonly discountRatePercent: number;
  readonly projectedRetirementBenefit: number;
  readonly retirementYearsFromEntry: number;
  readonly yearsSinceEntry: number;
};

export type EntryAgeNormalLiabilityOutput = {
  readonly entryAgeNormalLiability: number;
  readonly normalCost: number;
};

export const entryAgeNormalLiabilityExample = {
  input: {
    discountRatePercent: 0,
    projectedRetirementBenefit: 100,
    retirementYearsFromEntry: 2,
    yearsSinceEntry: 1,
  },
  output: {
    entryAgeNormalLiability: 50,
    normalCost: 50,
  },
} satisfies ToolExample<
  EntryAgeNormalLiabilityInput,
  EntryAgeNormalLiabilityOutput
>;

export const calculateEntryAgeNormalLiability = (
  input: EntryAgeNormalLiabilityInput,
): EntryAgeNormalLiabilityOutput => {
  if (!(input.discountRatePercent > -100))
    simpleError(
      "discountRatePercent",
      "The discount rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  if (input.yearsSinceEntry > input.retirementYearsFromEntry)
    simpleError(
      "yearsSinceEntry",
      "Elapsed service cannot exceed the total working years from entry.",
      "service_exceeds_term",
    );
  const discount = 1 / (1 + input.discountRatePercent / 100);
  const remainingYears = input.retirementYearsFromEntry - input.yearsSinceEntry;
  const annuityFromEntry =
    input.discountRatePercent === 0
      ? input.retirementYearsFromEntry
      : (1 - discount ** input.retirementYearsFromEntry) / (1 - discount);
  const normalCost =
    (input.projectedRetirementBenefit *
      discount ** input.retirementYearsFromEntry) /
    annuityFromEntry;
  const annuityRemaining =
    input.discountRatePercent === 0
      ? remainingYears
      : (1 - discount ** remainingYears) / (1 - discount);
  const liability =
    input.projectedRetirementBenefit * discount ** remainingYears -
    normalCost * annuityRemaining;
  return {
    entryAgeNormalLiability: liability,
    normalCost,
  };
};

export const entryAgeNormalLiabilityTool = createSimpleTool({
  calculate: (input) =>
    calculateEntryAgeNormalLiability({
      discountRatePercent: input.discountRatePercent as number,
      projectedRetirementBenefit: input.projectedRetirementBenefit as number,
      retirementYearsFromEntry: input.retirementYearsFromEntry as number,
      yearsSinceEntry: input.yearsSinceEntry as number,
    }),
  description:
    "Allocate a projected lump-sum retirement benefit to level annual normal costs from entry age to retirement and calculate the accrued liability for completed service.",
  id: "actuarial/entry-age-normal-liability",
  inputs: [
    {
      description:
        "Annual discount rate in percent used to value future benefits; must be greater than -100.",
      id: "discountRatePercent",
      kind: "number",
      label: "Discount rate",
      minimum: -100,
      unit: "%",
    },
    {
      description: "Projected lump-sum benefit payable at retirement.",
      id: "projectedRetirementBenefit",
      kind: "number",
      label: "Projected retirement benefit",
      minimum: 0,
    },
    {
      description: "Total years from plan entry to retirement.",
      id: "retirementYearsFromEntry",
      kind: "integer",
      label: "Retirement years from entry",
      minimum: 1,
    },
    {
      description: "Years of service completed since entry.",
      id: "yearsSinceEntry",
      kind: "integer",
      label: "Years since entry",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Accumulated entry age normal liability today.",
      id: "entryAgeNormalLiability",
      kind: "number",
      label: "Entry age normal liability",
    },
    {
      description: "Level annual normal cost from entry to retirement.",
      id: "normalCost",
      kind: "number",
      label: "Normal cost",
    },
  ],
  title: "Entry Age Normal Liability Calculator",
});
export const runEntryAgeNormalLiability = entryAgeNormalLiabilityTool.execute;
export default entryAgeNormalLiabilityTool;
