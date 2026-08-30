import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ungatedBackground: number;
  readonly gatedBackground: number;
  readonly ungatedDesiredSignal: number;
  readonly gatedDesiredSignal: number;
}>;
export type Output = Readonly<{
  readonly backgroundSuppressionDb: number;
  readonly signalTransmissionPercent: number;
  readonly snrImprovementFactor: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.gatedBackground <= 0 ||
    input.ungatedDesiredSignal <= 0 ||
    input.ungatedBackground <= 0
  )
    simpleError(
      "gatedBackground",
      "Backgrounds and ungated desired signal must be positive.",
      "invalid_signal",
    );
  const backgroundSuppressionDb =
    10 * Math.log10(input.ungatedBackground / input.gatedBackground);
  const signalTransmissionPercent =
    (input.gatedDesiredSignal / input.ungatedDesiredSignal) * 100;
  return {
    backgroundSuppressionDb,
    signalTransmissionPercent,
    snrImprovementFactor:
      input.gatedDesiredSignal /
      input.gatedBackground /
      (input.ungatedDesiredSignal / input.ungatedBackground),
  };
};

export const exampleInput = {
  ungatedBackground: 100,
  gatedBackground: 1,
  ungatedDesiredSignal: 50,
  gatedDesiredSignal: 25,
} satisfies Input;
export const exampleOutput = {
  backgroundSuppressionDb: 20,
  signalTransmissionPercent: 50,
  snrImprovementFactor: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ungatedBackground: input.ungatedBackground as number,
      gatedBackground: input.gatedBackground as number,
      ungatedDesiredSignal: input.ungatedDesiredSignal as number,
      gatedDesiredSignal: input.gatedDesiredSignal as number,
    }),
  description:
    "Measure Kerr-gate background suppression, desired-signal transmission, and SNR improvement.",
  id: "laser/kerr-gate-suppression",
  inputs: [
    {
      id: "ungatedBackground",
      label: "Ungated background signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "gatedBackground",
      label: "Kerr-gated background signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "ungatedDesiredSignal",
      label: "Ungated desired signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "gatedDesiredSignal",
      label: "Kerr-gated desired signal",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "backgroundSuppressionDb",
      label: "Background suppression",
      kind: "number",
      unit: "dB",
    },
    {
      id: "signalTransmissionPercent",
      label: "Desired-signal transmission",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "snrImprovementFactor",
      label: "Signal-to-background improvement",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Kerr-Gate Suppression",
});

export const run = tool.execute;
export default tool;
