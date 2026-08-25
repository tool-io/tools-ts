import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FructoseGlucoseRatioCheckerInput = {
  readonly fructoseDominantRatio: number;
  readonly fructoseGPerL: number;
  readonly glucoseGPerL: number;
  readonly watchRatio: number;
};

export type FructoseGlucoseRatioCheckerOutput = {
  readonly fructoseGlucoseRatio: number;
  readonly status: string;
};

export const fructoseGlucoseRatioCheckerExample = {
  input: {
    fructoseDominantRatio: 2,
    fructoseGPerL: 10,
    glucoseGPerL: 10,
    watchRatio: 1.2,
  },
  output: {
    fructoseGlucoseRatio: 1,
    status: "below_watch_threshold",
  },
} satisfies ToolExample<
  FructoseGlucoseRatioCheckerInput,
  FructoseGlucoseRatioCheckerOutput
>;

export const calculateFructoseGlucoseRatio = (
  input: FructoseGlucoseRatioCheckerInput,
): FructoseGlucoseRatioCheckerOutput => {
  if (input.glucoseGPerL <= 0)
    simpleError(
      "glucoseGPerL",
      "The glucose concentration must be positive to form a ratio.",
      "invalid_value",
    );
  if (input.fructoseDominantRatio <= input.watchRatio)
    simpleError(
      "fructoseDominantRatio",
      "The fructose-dominant threshold must exceed the watch threshold.",
      "invalid_value",
    );
  const ratio = roundStatistic(input.fructoseGPerL / input.glucoseGPerL);
  return {
    fructoseGlucoseRatio: ratio,
    status:
      ratio >= input.fructoseDominantRatio
        ? "fructose_dominant"
        : ratio >= input.watchRatio
          ? "watch"
          : "below_watch_threshold",
  };
};

export const fructoseGlucoseRatioCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateFructoseGlucoseRatio(
      input as unknown as FructoseGlucoseRatioCheckerInput,
    ),
  description:
    "Calculate the fructose-to-glucose ratio and compare it with caller-selected watch and fructose-dominant thresholds; the ratio alone does not diagnose a stuck fermentation.",
  id: "oenology/fructose-glucose-ratio-checker",
  inputs: [
    {
      description: "Ratio at or above which the high category begins.",
      id: "fructoseDominantRatio",
      kind: "number",
      label: "Fructose-dominant threshold",
      minimum: 0,
    },
    {
      description: "Fructose measured in the fermenting wine.",
      id: "fructoseGPerL",
      kind: "number",
      label: "Fructose",
      minimum: 0,
      unit: "g/L",
    },
    {
      description: "Ratio at or above which the watch category begins.",
      id: "watchRatio",
      kind: "number",
      label: "Watch threshold",
      minimum: 0,
    },
    {
      description: "Glucose measured in the fermenting wine.",
      id: "glucoseGPerL",
      kind: "number",
      label: "Glucose",
      minimum: 0,
      unit: "g/L",
    },
  ],
  outputs: [
    {
      description: "Fructose divided by glucose.",
      id: "fructoseGlucoseRatio",
      kind: "number",
      label: "F/G ratio",
    },
    {
      description: "One of below_watch_threshold, watch, or fructose_dominant.",
      id: "status",
      kind: "string",
      label: "Status",
    },
  ],
  title: "Fructose-Glucose Ratio Checker",
});
export const runFructoseGlucoseRatioChecker =
  fructoseGlucoseRatioCheckerTool.execute;
export default fructoseGlucoseRatioCheckerTool;
