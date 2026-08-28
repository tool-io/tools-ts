import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const microphoneSensitivityVoltageExample = {
  input: { sensitivityDbV: -38 },
} satisfies ToolExample<{
  readonly sensitivityDbV: number;
}>;

export const microphoneSensitivityVoltageTool = createSimpleTool({
  id: "electronics/microphone-sensitivity-voltage",
  title: "Mic Sensitivity mV/Pa",
  description:
    "Convert microphone sensitivity from dBV per pascal to millivolts per pascal as mvPerPa = 10^(sensitivityDbV / 20) * 1000, referenced to 1 V/Pa.",
  inputs: [
    {
      description: "Sensitivity in decibels relative to 1 V/Pa.",
      id: "sensitivityDbV",
      kind: "number",
      label: "Sensitivity",
      maximum: 10,
      minimum: -100,
      unit: "dBV/Pa",
    },
  ],
  outputs: [
    {
      description: "Output voltage per pascal of acoustic pressure.",
      id: "micSensitivityMvPerPa",
      kind: "number",
      label: "Sensitivity",
      unit: "mV/Pa",
    },
  ],
  calculate: (input) => ({
    micSensitivityMvPerPa:
      Math.pow(10, (input.sensitivityDbV as number) / 20) * 1000,
  }),
});
export const runMicrophoneSensitivityVoltage =
  microphoneSensitivityVoltageTool.execute;
export default microphoneSensitivityVoltageTool;
