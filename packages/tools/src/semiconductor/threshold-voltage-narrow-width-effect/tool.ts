import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThresholdVoltageNarrowWidthEffectInput = {
  readonly channelWidthNm: number;
  readonly minimumChannelWidthNm: number;
  readonly narrowWidthCoefficient: number;
};

export type ThresholdVoltageNarrowWidthEffectOutput = {
  readonly thresholdShiftMillivolts: number;
};

export const thresholdVoltageNarrowWidthEffectExample = {
  input: {
    channelWidthNm: 1000,
    minimumChannelWidthNm: 100,
    narrowWidthCoefficient: 20,
  },
  output: { thresholdShiftMillivolts: 2 },
} satisfies ToolExample<
  ThresholdVoltageNarrowWidthEffectInput,
  ThresholdVoltageNarrowWidthEffectOutput
>;

export const thresholdVoltageNarrowWidthEffectTool = createSimpleTool({
  id: "semiconductor/threshold-voltage-narrow-width-effect",
  title: "Narrow Width Effect Calculator",
  description:
    "Estimate the positive threshold-voltage shift caused by the narrow width effect relative to the minimum channel width.",
  inputs: [
    {
      id: "channelWidthNm",
      label: "Channel width",
      kind: "number",
      minimum: 0,
      unit: "nm",
      description: "Actual channel width.",
    },
    {
      id: "minimumChannelWidthNm",
      label: "Minimum channel width",
      kind: "number",
      minimum: 0,
      unit: "nm",
      description: "Technology minimum channel width.",
    },
    {
      id: "narrowWidthCoefficient",
      label: "Narrow-width coefficient",
      kind: "number",
      unit: "mV",
      description: "Narrow-width coefficient in millivolts.",
    },
  ],
  outputs: [
    {
      id: "thresholdShiftMillivolts",
      label: "Threshold shift",
      kind: "number",
      unit: "mV",
      description: "Positive threshold-voltage shift in millivolts.",
    },
  ],
  calculate: (input) => {
    const channelWidthNm = input.channelWidthNm as number;
    const minimumChannelWidthNm = input.minimumChannelWidthNm as number;
    const narrowWidthCoefficient = input.narrowWidthCoefficient as number;
    if (channelWidthNm <= 0)
      simpleError(
        "channelWidthNm",
        "Channel width must be positive.",
        "invalid_width",
      );
    if (minimumChannelWidthNm <= 0)
      simpleError(
        "minimumChannelWidthNm",
        "Minimum channel width must be positive.",
        "invalid_width",
      );
    if (!(narrowWidthCoefficient >= 0))
      simpleError(
        "narrowWidthCoefficient",
        "Narrow-width coefficient cannot be negative.",
        "invalid_coefficient",
      );
    return {
      thresholdShiftMillivolts:
        narrowWidthCoefficient * (minimumChannelWidthNm / channelWidthNm),
    };
  },
});
export const runThresholdVoltageNarrowWidthEffect =
  thresholdVoltageNarrowWidthEffectTool.execute;
export default thresholdVoltageNarrowWidthEffectTool;
