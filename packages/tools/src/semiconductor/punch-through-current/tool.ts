import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PunchThroughCurrentInput = {
  readonly channelLengthNm: number;
  readonly characteristicLengthNm: number;
  readonly prethresholdCurrentNanoA: number;
};

export type PunchThroughCurrentOutput = {
  readonly punchThroughNanoA: number;
};

export const punchThroughCurrentExample = {
  input: {
    channelLengthNm: 5,
    characteristicLengthNm: 10,
    prethresholdCurrentNanoA: 100,
  },
  output: { punchThroughNanoA: 60.653065971263345 },
} satisfies ToolExample<PunchThroughCurrentInput, PunchThroughCurrentOutput>;

export const punchThroughCurrentTool = createSimpleTool({
  calculate: (input) => {
    const channelLengthNm = input.channelLengthNm as number;
    const characteristicLength = input.characteristicLengthNm as number;
    const prethresholdCurrentNanoA = input.prethresholdCurrentNanoA as number;
    if (!(channelLengthNm > 0))
      simpleError(
        "channelLengthNm",
        "Channel length must be positive.",
        "invalid_channel_length",
      );
    if (!(characteristicLength > 0))
      simpleError(
        "characteristicLengthNm",
        "Characteristic length must be positive.",
        "invalid_characteristic_length",
      );
    return {
      punchThroughNanoA:
        prethresholdCurrentNanoA *
        Math.exp(-channelLengthNm / characteristicLength),
    };
  },
  description:
    "Estimate subthreshold punch-through current from the prethreshold current and channel length decay.",
  id: "semiconductor/punch-through-current",
  inputs: [
    {
      description: "Effective electrical channel length.",
      format: "length-nm",
      id: "channelLengthNm",
      kind: "number",
      label: "Channel length",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Characteristic decay length of the barrier lowering.",
      id: "characteristicLengthNm",
      kind: "number",
      label: "Characteristic length",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Prethreshold current driving the punch-through path.",
      format: "current-na",
      id: "prethresholdCurrentNanoA",
      kind: "number",
      label: "Prethreshold current",
      minimum: 0,
      unit: "nA",
    },
  ],
  outputs: [
    {
      description: "Punch-through leakage current.",
      format: "current-na",
      id: "punchThroughNanoA",
      kind: "number",
      label: "Punch-through current",
      minimum: 0,
      unit: "nA",
    },
  ],
  title: "Punch-Through Current Calculator",
});
export const runPunchThroughCurrent = punchThroughCurrentTool.execute;
export default punchThroughCurrentTool;
