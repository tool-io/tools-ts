import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CharcoalDecolorizingDoseInput = {
  readonly maximumRateGPerHectoliter: number;
  readonly rateGPerHectoliter: number;
  readonly volumeHectoliters: number;
};

export type CharcoalDecolorizingDoseOutput = {
  readonly charcoalGrams: number;
  readonly withinRecommendedCap: boolean;
};

export const charcoalDecolorizingDoseExample = {
  input: {
    rateGPerHectoliter: 10,
    maximumRateGPerHectoliter: 50,
    volumeHectoliters: 8,
  },
  output: {
    charcoalGrams: 80,
    withinRecommendedCap: true,
  },
} satisfies ToolExample<
  CharcoalDecolorizingDoseInput,
  CharcoalDecolorizingDoseOutput
>;

export const calculateCharcoalDecolorizingDose = (
  input: CharcoalDecolorizingDoseInput,
): CharcoalDecolorizingDoseOutput => {
  if (input.rateGPerHectoliter < 0)
    simpleError(
      "rateGPerHectoliter",
      "The charcoal rate cannot be negative.",
      "invalid_value",
    );
  return {
    charcoalGrams: roundStatistic(
      input.rateGPerHectoliter * input.volumeHectoliters,
    ),
    withinRecommendedCap:
      input.rateGPerHectoliter <= input.maximumRateGPerHectoliter,
  };
};

export const charcoalDecolorizingDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateCharcoalDecolorizingDose(
      input as unknown as CharcoalDecolorizingDoseInput,
    ),
  description:
    "Convert a selected activated-charcoal treatment rate into total mass and compare it with a caller-supplied product, trial, or regulatory limit.",
  id: "oenology/charcoal-decolorizing-dose",
  inputs: [
    {
      description: "Activated charcoal specified per hectoliter of wine.",
      id: "rateGPerHectoliter",
      kind: "number",
      label: "Dose rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description: "Maximum rate allowed by the applicable treatment plan.",
      id: "maximumRateGPerHectoliter",
      kind: "number",
      label: "Maximum rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description: "Wine volume to treat.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "hL",
    },
  ],
  outputs: [
    {
      description: "Charcoal to prepare for the treated volume.",
      id: "charcoalGrams",
      kind: "number",
      label: "Charcoal",
      unit: "g",
    },
    {
      description:
        "Whether the dose rate stays at or below the supplied maximum.",
      id: "withinRecommendedCap",
      kind: "boolean",
      label: "Within recommended cap",
    },
  ],
  title: "Charcoal Color Fix Dose Calculator",
});
export const runCharcoalDecolorizingDose = charcoalDecolorizingDoseTool.execute;
export default charcoalDecolorizingDoseTool;
