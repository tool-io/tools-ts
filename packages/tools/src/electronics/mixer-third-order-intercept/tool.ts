import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MixerThirdOrderInterceptInput = {
  readonly imProductDbm: number;
  readonly inputDbm: number;
};

export type MixerThirdOrderInterceptOutput = {
  readonly outputIp3Dbm: number;
};

export const mixerThirdOrderInterceptExample = {
  input: { imProductDbm: -40, inputDbm: -10 },
  output: { outputIp3Dbm: 5 },
} satisfies ToolExample<
  MixerThirdOrderInterceptInput,
  MixerThirdOrderInterceptOutput
>;

const finiteInput = (field: string, label: string, value: number) => {
  if (!Number.isFinite(value))
    simpleError(field, `${label} must be a finite value.`);
};

export const calculateMixerThirdOrderIntercept = (
  input: MixerThirdOrderInterceptInput,
): MixerThirdOrderInterceptOutput => {
  finiteInput("inputDbm", "Input level", input.inputDbm);
  finiteInput("imProductDbm", "IM product level", input.imProductDbm);
  return {
    outputIp3Dbm: input.inputDbm + (input.inputDbm - input.imProductDbm) / 2,
  };
};

export const mixerThirdOrderInterceptTool = createSimpleTool({
  calculate: (input) =>
    calculateMixerThirdOrderIntercept(
      input as unknown as MixerThirdOrderInterceptInput,
    ),
  description:
    "Extrapolate the third-order intercept point of a mixer from one tone level and its measured third-order intermodulation product.",
  id: "electronics/mixer-third-order-intercept",
  inputs: [
    {
      description: "Level of each fundamental test tone.",
      format: "power",
      id: "inputDbm",
      kind: "number",
      label: "Tone input level",
      unit: "dBm",
    },
    {
      description: "Measured third-order intermodulation product level.",
      format: "power",
      id: "imProductDbm",
      kind: "number",
      label: "IM3 product level",
      unit: "dBm",
    },
  ],
  outputs: [
    {
      description: "Extrapolated input-referred third-order intercept point.",
      format: "power",
      id: "outputIp3Dbm",
      kind: "number",
      label: "IP3",
      unit: "dBm",
    },
  ],
  title: "Mixer IP3",
});
export const runMixerThirdOrderIntercept = mixerThirdOrderInterceptTool.execute;
export default mixerThirdOrderInterceptTool;
