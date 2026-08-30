import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly signalMeanPhotons: number;
  readonly signalGain: number;
  readonly decoyMeanPhotons: number;
  readonly decoyGain: number;
  readonly vacuumGain: number;
}>;
export type Output = Readonly<{
  readonly signalDetectionScore: number;
  readonly decoyDetectionScore: number;
  readonly signalToDecoyScoreRatio: number;
}>;

export const calculate = (input: Input): Output => {
  const signalDetectionScore = input.signalMeanPhotons * input.signalGain;
  const decoyDetectionScore =
    input.decoyMeanPhotons * Math.max(0, input.decoyGain - input.vacuumGain);
  return {
    signalDetectionScore,
    decoyDetectionScore,
    signalToDecoyScoreRatio:
      decoyDetectionScore === 0
        ? 0
        : signalDetectionScore / decoyDetectionScore,
  };
};

export const exampleInput = {
  signalMeanPhotons: 0.5,
  signalGain: 0.1,
  decoyMeanPhotons: 0.1,
  decoyGain: 0.05,
  vacuumGain: 0.01,
} satisfies Input;
export const exampleOutput = {
  signalDetectionScore: 0.05,
  decoyDetectionScore: 0.004,
  signalToDecoyScoreRatio: 12.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      signalMeanPhotons: input.signalMeanPhotons as number,
      signalGain: input.signalGain as number,
      decoyMeanPhotons: input.decoyMeanPhotons as number,
      decoyGain: input.decoyGain as number,
      vacuumGain: input.vacuumGain as number,
    }),
  description:
    "Score supplied signal and decoy intensities from observed gains; this is not a security proof.",
  id: "laser/decoy-state-intensity-score",
  inputs: [
    {
      id: "signalMeanPhotons",
      label: "Signal mean photon number",
      kind: "number",
      minimum: 0,
    },
    {
      id: "signalGain",
      label: "Signal detection gain",
      kind: "number",
      minimum: 0,
    },
    {
      id: "decoyMeanPhotons",
      label: "Decoy mean photon number",
      kind: "number",
      minimum: 0,
    },
    {
      id: "decoyGain",
      label: "Decoy detection gain",
      kind: "number",
      minimum: 0,
    },
    {
      id: "vacuumGain",
      label: "Vacuum detection gain",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "signalDetectionScore",
      label: "Signal intensity score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "decoyDetectionScore",
      label: "Decoy intensity score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "signalToDecoyScoreRatio",
      label: "Signal-to-decoy score ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Decoy-State Intensity Score",
});

export const run = tool.execute;
export default tool;
