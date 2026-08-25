import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BarrelExtractionEquivalentDaysInput = {
  readonly contactDays: number;
  readonly relativeExtractionPercent: number;
};

export type BarrelExtractionEquivalentDaysOutput = {
  readonly equivalentNewBarrelDays: number;
};

export const barrelExtractionEquivalentDaysExample = {
  input: {
    contactDays: 180,
    relativeExtractionPercent: 70,
  },
  output: {
    equivalentNewBarrelDays: 126,
  },
} satisfies ToolExample<
  BarrelExtractionEquivalentDaysInput,
  BarrelExtractionEquivalentDaysOutput
>;

export const calculateBarrelExtractionEquivalentDays = (
  input: BarrelExtractionEquivalentDaysInput,
): BarrelExtractionEquivalentDaysOutput => {
  if (
    input.relativeExtractionPercent < 0 ||
    input.relativeExtractionPercent > 100
  )
    simpleError(
      "relativeExtractionPercent",
      "Relative extraction must be between zero and one hundred percent.",
      "invalid_value",
    );
  return {
    equivalentNewBarrelDays: roundStatistic(
      input.contactDays * (input.relativeExtractionPercent / 100),
    ),
  };
};

export const barrelExtractionEquivalentDaysTool = createSimpleTool({
  calculate: (input) =>
    calculateBarrelExtractionEquivalentDays(
      input as unknown as BarrelExtractionEquivalentDaysInput,
    ),
  description:
    "Convert actual oak contact time into new-barrel-equivalent days using a relative extraction percentage obtained from the barrel program, trials, or another calibrated model.",
  id: "oenology/barrel-extraction-equivalent-days",
  inputs: [
    {
      description: "Actual days of wine on oak.",
      id: "contactDays",
      kind: "number",
      label: "Contact days",
      minimum: 0,
    },
    {
      description:
        "Expected extraction relative to the chosen new-barrel reference.",
      id: "relativeExtractionPercent",
      kind: "number",
      label: "Relative extraction",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description:
        "Oak contact expressed as days the same wine would need in a new barrel.",
      id: "equivalentNewBarrelDays",
      kind: "number",
      label: "Equivalent days",
    },
  ],
  title: "Barrel Extraction Equivalent Days Calculator",
});
export const runBarrelExtractionEquivalentDays =
  barrelExtractionEquivalentDaysTool.execute;
export default barrelExtractionEquivalentDaysTool;
