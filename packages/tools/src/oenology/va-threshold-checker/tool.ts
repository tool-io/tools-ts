import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type VaThresholdCheckerInput = {
  readonly style: string;
  readonly vaGPerL: number;
};

export type VaThresholdCheckerOutput = {
  readonly excessGPerL: number;
  readonly withinLegalLimit: boolean;
};

export const vaThresholdCheckerExample = {
  input: {
    style: "red",
    vaGPerL: 0.8,
  },
  output: {
    excessGPerL: 0,
    withinLegalLimit: true,
  },
} satisfies ToolExample<VaThresholdCheckerInput, VaThresholdCheckerOutput>;

const VA_LIMIT_G_PER_L_BY_STYLE: Record<string, number> = {
  red: 1.4,
  rose: 1.2,
  white: 1.2,
};

export const calculateVaThreshold = (
  input: VaThresholdCheckerInput,
): VaThresholdCheckerOutput => {
  const limit = VA_LIMIT_G_PER_L_BY_STYLE[input.style];
  if (limit === undefined)
    simpleError("style", "Choose one of red, white, or rose.", "invalid_value");
  const excess = Math.max(0, roundStatistic(input.vaGPerL - limit));
  return {
    excessGPerL: excess,
    withinLegalLimit: excess === 0,
  };
};

export const vaThresholdCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateVaThreshold(input as unknown as VaThresholdCheckerInput),
  description:
    "Check volatile acidity against the general United States limits of 1.4 grams per liter for red wine and 1.2 grams per liter for white or rosé wine, expressed as acetic acid.",
  id: "oenology/va-threshold-checker",
  inputs: [
    {
      description: "Wine category: red, white, or rose.",
      id: "style",
      kind: "string",
      label: "Style",
    },
    {
      description: "Volatile acidity expressed as acetic acid.",
      id: "vaGPerL",
      kind: "number",
      label: "VA",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description: "Amount above the legal limit, if any.",
      id: "excessGPerL",
      kind: "number",
      label: "Excess",
      unit: "g/L",
    },
    {
      description: "Whether the wine sits at or below the limit.",
      id: "withinLegalLimit",
      kind: "boolean",
      label: "Within limit",
    },
  ],
  title: "Volatile Acidity VA Threshold Checker",
});
export const runVaThresholdChecker = vaThresholdCheckerTool.execute;
export default vaThresholdCheckerTool;
