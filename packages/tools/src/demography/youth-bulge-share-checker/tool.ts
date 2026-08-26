import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type YouthBulgeShareCheckerInput = {
  readonly populationAged15to29: number;
  readonly populationAged30AndOver: number;
  readonly thresholdPercent?: number;
};

export type YouthBulgeShareCheckerOutput = {
  readonly youthShareOfAdultsPercent: number;
  readonly youthBulge: boolean;
};

export const calculateYouthBulgeShareChecker = (
  input: YouthBulgeShareCheckerInput,
): YouthBulgeShareCheckerOutput => {
  const threshold = input.thresholdPercent ?? 30;
  if (!(input.populationAged15to29 >= 0))
    return simpleError(
      "populationAged15to29",
      "The youth population count must be non-negative.",
      "invalid_population",
    );
  if (!(input.populationAged30AndOver > 0))
    return simpleError(
      "populationAged30AndOver",
      "The adult population aged 30 and over must be greater than zero.",
      "invalid_population",
    );
  if (!(threshold >= 0 && threshold <= 100))
    return simpleError(
      "thresholdPercent",
      "The threshold must lie between zero and one hundred percent.",
      "invalid_threshold",
    );
  const adultTotal = input.populationAged15to29 + input.populationAged30AndOver;
  const youthShareOfAdultsPercent =
    (input.populationAged15to29 / adultTotal) * 100;
  return {
    youthShareOfAdultsPercent,
    youthBulge: youthShareOfAdultsPercent >= threshold,
  };
};

export const youthBulgeShareCheckerExample = {
  input: { populationAged15to29: 8000000, populationAged30AndOver: 22000000 },
  output: { youthShareOfAdultsPercent: 26.666666666666668, youthBulge: false },
} satisfies ToolExample<
  YouthBulgeShareCheckerInput,
  YouthBulgeShareCheckerOutput
>;

export const youthBulgeShareCheckerTool = createSimpleTool({
  id: "demography/youth-bulge-share-checker",
  title: "Youth Bulge Share Checker",
  description:
    "Check for a youth bulge by testing whether the population aged 15-29 is at least a given share (default thirty percent) of the total adult population aged 15 and over.",
  inputs: [
    {
      description: "Population aged 15-29.",
      id: "populationAged15to29",
      kind: "number",
      label: "Ages 15-29",
      minimum: 0,
    },
    {
      description: "Population aged 30 and over.",
      id: "populationAged30AndOver",
      kind: "number",
      label: "Ages 30+",
      minimum: 0,
    },
    {
      default: 30,
      description:
        "Youth share of adults at or above which a bulge is declared.",
      id: "thresholdPercent",
      kind: "number",
      label: "Threshold %",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Population aged 15-29 as a percent of all adults aged 15+.",
      id: "youthShareOfAdultsPercent",
      kind: "number",
      label: "Youth share",
    },
    {
      description: "True when the youth share meets or exceeds the threshold.",
      id: "youthBulge",
      kind: "boolean",
      label: "Youth bulge",
    },
  ],
  calculate: (input) =>
    calculateYouthBulgeShareChecker(
      input as unknown as YouthBulgeShareCheckerInput,
    ),
});

export const runYouthBulgeShareChecker = youthBulgeShareCheckerTool.execute;
export default youthBulgeShareCheckerTool;
