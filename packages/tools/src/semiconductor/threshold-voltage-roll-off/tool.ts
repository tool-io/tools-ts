import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThresholdVoltageRollOffInput = {
  readonly channelLengthNm: number;
  readonly minimumChannelLengthNm: number;
  readonly rollOffCoefficient: number;
};

export type ThresholdVoltageRollOffOutput = {
  readonly thresholdShiftMillivolts: number;
};

export const thresholdVoltageRollOffExample = {
  input: {
    channelLengthNm: 100,
    minimumChannelLengthNm: 50,
    rollOffCoefficient: 50,
  },
  output: { thresholdShiftMillivolts: -12.5 },
} satisfies ToolExample<
  ThresholdVoltageRollOffInput,
  ThresholdVoltageRollOffOutput
>;

export const thresholdVoltageRollOffTool = createSimpleTool({
  id: "semiconductor/threshold-voltage-roll-off",
  title: "Threshold Voltage Roll-Off Calculator",
  description:
    "Estimate the negative threshold-voltage shift caused by short-channel roll-off relative to the minimum channel length.",
  inputs: [
    {
      id: "channelLengthNm",
      label: "Channel length",
      kind: "number",
      minimum: 0,
      unit: "nm",
      description: "Actual channel length.",
    },
    {
      id: "minimumChannelLengthNm",
      label: "Minimum channel length",
      kind: "number",
      minimum: 0,
      unit: "nm",
      description: "Technology minimum channel length.",
    },
    {
      id: "rollOffCoefficient",
      label: "Roll-off coefficient",
      kind: "number",
      unit: "mV",
      description: "Roll-off coefficient in millivolts.",
    },
  ],
  outputs: [
    {
      id: "thresholdShiftMillivolts",
      label: "Threshold shift",
      kind: "number",
      unit: "mV",
      description: "Negative threshold-voltage shift in millivolts.",
    },
  ],
  calculate: (input) => {
    const channelLengthNm = input.channelLengthNm as number;
    const minimumChannelLengthNm = input.minimumChannelLengthNm as number;
    const rollOffCoefficient = input.rollOffCoefficient as number;
    if (channelLengthNm <= 0)
      simpleError(
        "channelLengthNm",
        "Channel length must be positive.",
        "invalid_length",
      );
    if (minimumChannelLengthNm <= 0)
      simpleError(
        "minimumChannelLengthNm",
        "Minimum channel length must be positive.",
        "invalid_length",
      );
    if (!(rollOffCoefficient >= 0))
      simpleError(
        "rollOffCoefficient",
        "Roll-off coefficient cannot be negative.",
        "invalid_coefficient",
      );
    return {
      thresholdShiftMillivolts:
        -rollOffCoefficient *
        Math.pow(minimumChannelLengthNm / channelLengthNm, 2),
    };
  },
});
export const runThresholdVoltageRollOff = thresholdVoltageRollOffTool.execute;
export default thresholdVoltageRollOffTool;
