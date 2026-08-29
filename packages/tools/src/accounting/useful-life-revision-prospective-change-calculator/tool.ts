import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UsefulLifeRevisionInput = {
  readonly accumulatedDepreciation: number;
  readonly cost: number;
  readonly newRemainingYears: number;
  readonly newSalvageValue: number;
};

export type UsefulLifeRevisionOutput = {
  readonly bookValueAtRevision: number;
  readonly revisedAnnualDepreciation: number;
};

export const usefulLifeRevisionExample = {
  input: {
    accumulatedDepreciation: 113750,
    cost: 500000,
    newRemainingYears: 40,
    newSalvageValue: 45000,
  },
  output: {
    bookValueAtRevision: 386250,
    revisedAnnualDepreciation: 8531.25,
  },
} satisfies ToolExample<UsefulLifeRevisionInput, UsefulLifeRevisionOutput>;

export const calculateUsefulLifeRevision = (
  input: UsefulLifeRevisionInput,
): UsefulLifeRevisionOutput => {
  if (!Number.isFinite(input.cost) || input.cost <= 0)
    simpleError(
      "cost",
      "The asset cost must be finite and greater than zero.",
      "positive_cost_required",
    );
  if (
    !Number.isFinite(input.accumulatedDepreciation) ||
    input.accumulatedDepreciation < 0
  )
    simpleError(
      "accumulatedDepreciation",
      "Accumulated depreciation must be a finite non-negative number.",
      "invalid_accumulated_depreciation",
    );
  if (input.accumulatedDepreciation > input.cost)
    simpleError(
      "accumulatedDepreciation",
      "Accumulated depreciation must not exceed the asset cost.",
      "accumulated_exceeds_cost",
    );
  if (!Number.isFinite(input.newRemainingYears) || input.newRemainingYears <= 0)
    simpleError(
      "newRemainingYears",
      "The revised remaining life must be finite and greater than zero.",
      "positive_remaining_years_required",
    );
  if (!Number.isFinite(input.newSalvageValue) || input.newSalvageValue < 0)
    simpleError(
      "newSalvageValue",
      "The revised salvage value must be a finite non-negative number.",
      "invalid_salvage",
    );
  const bookValueAtRevision = input.cost - input.accumulatedDepreciation;
  if (input.newSalvageValue > bookValueAtRevision)
    simpleError(
      "newSalvageValue",
      "The revised salvage value must not exceed the book value at revision.",
      "salvage_exceeds_book_value",
    );
  const revisedAnnualDepreciation =
    (bookValueAtRevision - input.newSalvageValue) / input.newRemainingYears;
  if (!Number.isFinite(revisedAnnualDepreciation))
    simpleError(
      "newRemainingYears",
      "Revised depreciation exceeds the finite numeric range.",
      "result_not_finite",
    );
  return { bookValueAtRevision, revisedAnnualDepreciation };
};

export const usefulLifeRevisionTool = createSimpleTool({
  calculate: (input) =>
    calculateUsefulLifeRevision({
      accumulatedDepreciation: input.accumulatedDepreciation as number,
      cost: input.cost as number,
      newRemainingYears: input.newRemainingYears as number,
      newSalvageValue: input.newSalvageValue as number,
    }),
  description:
    "Compute revised annual straight-line depreciation after a useful-life estimate change: book value at revision minus revised salvage, divided by remaining years, applied prospectively.",
  id: "accounting/useful-life-revision-prospective-change-calculator",
  inputs: [
    {
      description: "Original capitalized cost of the asset.",
      id: "cost",
      kind: "number",
      label: "Cost",
      minimum: 0,
    },
    {
      description:
        "Accumulated depreciation recorded through the revision date.",
      id: "accumulatedDepreciation",
      kind: "number",
      label: "Accumulated depreciation",
      minimum: 0,
    },
    {
      description:
        "Revised remaining useful life in years measured from the revision date; must be greater than zero.",
      id: "newRemainingYears",
      kind: "number",
      label: "New remaining years",
    },
    {
      description:
        "Revised salvage value expected at the end of the revised life.",
      id: "newSalvageValue",
      kind: "number",
      label: "New salvage value",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Cost less accumulated depreciation at the revision date, the basis for the prospective change.",
      id: "bookValueAtRevision",
      kind: "number",
      label: "Book value at revision",
    },
    {
      description:
        "Annual straight-line depreciation for remaining years after the revision.",
      id: "revisedAnnualDepreciation",
      kind: "number",
      label: "Revised annual depreciation",
    },
  ],
  title: "Useful Life Revision Calculator",
});
export const runUsefulLifeRevision = usefulLifeRevisionTool.execute;
export default usefulLifeRevisionTool;
