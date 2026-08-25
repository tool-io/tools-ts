import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LightstrikeRiskCheckerInput = {
  readonly bottleLightTransmissionPercent: number;
  readonly exposureHours: number;
  readonly highExposureThresholdHours: number;
  readonly moderateExposureThresholdHours: number;
};

export type LightstrikeRiskCheckerOutput = {
  readonly equivalentUnfilteredExposureHours: number;
  readonly riskLevel: string;
};

export const lightstrikeRiskCheckerExample = {
  input: {
    bottleLightTransmissionPercent: 75,
    exposureHours: 4,
    highExposureThresholdHours: 3,
    moderateExposureThresholdHours: 1,
  },
  output: {
    equivalentUnfilteredExposureHours: 3,
    riskLevel: "high",
  },
} satisfies ToolExample<
  LightstrikeRiskCheckerInput,
  LightstrikeRiskCheckerOutput
>;

export const calculateLightstrikeRisk = (
  input: LightstrikeRiskCheckerInput,
): LightstrikeRiskCheckerOutput => {
  if (input.highExposureThresholdHours <= input.moderateExposureThresholdHours)
    simpleError(
      "highExposureThresholdHours",
      "The high threshold must exceed the moderate threshold.",
      "invalid_value",
    );
  const equivalentHours =
    input.exposureHours * (input.bottleLightTransmissionPercent / 100);
  return {
    equivalentUnfilteredExposureHours: roundStatistic(equivalentHours),
    riskLevel:
      equivalentHours >= input.highExposureThresholdHours
        ? "high"
        : equivalentHours >= input.moderateExposureThresholdHours
          ? "moderate"
          : "low",
  };
};

export const lightstrikeRiskCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateLightstrikeRisk(input as unknown as LightstrikeRiskCheckerInput),
  description:
    "Convert exposure duration and measured bottle transmission into equivalent unfiltered light-hours, then compare that value with caller-supplied lightstrike thresholds.",
  id: "oenology/lightstrike-risk-checker",
  inputs: [
    {
      description:
        "Relevant-spectrum light transmitted by the bottle and packaging.",
      id: "bottleLightTransmissionPercent",
      kind: "number",
      label: "Light transmission",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Duration under the assessed light source.",
      id: "exposureHours",
      kind: "number",
      label: "Exposure",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Equivalent light-hours at which the high category begins.",
      id: "highExposureThresholdHours",
      kind: "number",
      label: "High threshold",
      minimum: 0,
      unit: "h",
    },
    {
      description:
        "Equivalent light-hours at which the moderate category begins.",
      id: "moderateExposureThresholdHours",
      kind: "number",
      label: "Moderate threshold",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "One of low, moderate, or high.",
      id: "riskLevel",
      kind: "string",
      label: "Risk level",
    },
    {
      description: "Exposure hours scaled by the transmitted-light fraction.",
      id: "equivalentUnfilteredExposureHours",
      kind: "number",
      label: "Equivalent unfiltered exposure",
      unit: "h",
    },
  ],
  title: "Lightstrike Risk UV Exposure Checker",
});
export const runLightstrikeRiskChecker = lightstrikeRiskCheckerTool.execute;
export default lightstrikeRiskCheckerTool;
