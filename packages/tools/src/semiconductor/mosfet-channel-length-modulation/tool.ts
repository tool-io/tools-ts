import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChannelLengthModulationInput = {
  readonly earlyVoltageV: number;
};

export type ChannelLengthModulationOutput = {
  readonly lambdaPerV: number;
};

export const channelLengthModulationExample = {
  input: { earlyVoltageV: 50 },
  output: { lambdaPerV: 0.02 },
} satisfies ToolExample<
  ChannelLengthModulationInput,
  ChannelLengthModulationOutput
>;

export const calculateChannelLengthModulation = (
  input: ChannelLengthModulationInput,
): ChannelLengthModulationOutput => {
  if (!Number.isFinite(input.earlyVoltageV) || input.earlyVoltageV <= 0)
    simpleError(
      "earlyVoltageV",
      "Early voltage must be finite and positive.",
      "invalid_input",
    );
  return { lambdaPerV: 1 / input.earlyVoltageV };
};

export const channelLengthModulationTool = createSimpleTool({
  calculate: (input) =>
    calculateChannelLengthModulation({
      earlyVoltageV: input.earlyVoltageV as number,
    }),
  description:
    "Compute the channel-length modulation parameter from the Early voltage.",
  id: "semiconductor/mosfet-channel-length-modulation",
  inputs: [
    {
      description: "Early voltage of the device.",
      format: "voltage-v",
      id: "earlyVoltageV",
      kind: "number",
      label: "Early voltage",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
  ],
  outputs: [
    {
      description:
        "Channel-length modulation parameter lambda in inverse volts.",
      format: "lambda-per-v",
      id: "lambdaPerV",
      kind: "number",
      label: "Lambda",
      minimum: Number.MIN_VALUE,
      unit: "V^-1",
    },
  ],
  title: "MOSFET Channel-Length Modulation Calculator",
});
export const runChannelLengthModulation = channelLengthModulationTool.execute;
export default channelLengthModulationTool;
