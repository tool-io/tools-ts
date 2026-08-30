import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly minimumSignalToNoiseDecibels: number;
  readonly noiseLevelDecibels: number;
  readonly speechLevelDecibels: number;
}>;
export type Output = Readonly<{
  readonly meetsCallerMinimum: boolean;
  readonly signalToNoiseDecibels: number;
}>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value))
      simpleError(
        field,
        "Levels and threshold must be finite.",
        "invalid_value",
      );
  const signalToNoiseDecibels =
    input.speechLevelDecibels - input.noiseLevelDecibels;
  if (!Number.isFinite(signalToNoiseDecibels))
    simpleError(
      "speechLevelDecibels",
      "Level difference is out of range.",
      "numeric_overflow",
    );
  return {
    signalToNoiseDecibels,
    meetsCallerMinimum:
      signalToNoiseDecibels >= input.minimumSignalToNoiseDecibels,
  };
};

export const example = {
  input: {
    minimumSignalToNoiseDecibels: 15,
    noiseLevelDecibels: 40,
    speechLevelDecibels: 58,
  },
  output: { signalToNoiseDecibels: 18, meetsCallerMinimum: true },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    minimumSignalToNoiseDecibels: 15,
    noiseLevelDecibels: 50,
    speechLevelDecibels: 60,
  },
  output: { signalToNoiseDecibels: 10, meetsCallerMinimum: false },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      minimumSignalToNoiseDecibels:
        input.minimumSignalToNoiseDecibels as number,
      noiseLevelDecibels: input.noiseLevelDecibels as number,
      speechLevelDecibels: input.speechLevelDecibels as number,
    }),
  description:
    "Calculate speech-to-noise level difference and compare it with an explicit caller-supplied minimum.",
  id: "acoustics/speech-snr-screen",
  inputs: [
    {
      id: "minimumSignalToNoiseDecibels",
      kind: "number",
      label: "Minimum signal-to-noise ratio",
      unit: "dB",
    },
    {
      id: "noiseLevelDecibels",
      kind: "number",
      label: "Noise level",
      unit: "dB",
    },
    {
      id: "speechLevelDecibels",
      kind: "number",
      label: "Speech level",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "signalToNoiseDecibels",
      kind: "number",
      label: "Signal-to-noise ratio",
      unit: "dB",
    },
    {
      id: "meetsCallerMinimum",
      kind: "boolean",
      label: "Meets caller minimum",
    },
  ],
  title: "Speech SNR Screen",
});

export const run = tool.execute;
export default tool;
