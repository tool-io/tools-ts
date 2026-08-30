import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OscillatorStartupTimeInput = Readonly<{
  readonly initialAmplitudeV: number;
  readonly targetAmplitudeV: number;
  readonly growthTimeConstantS: number;
}>;
export type OscillatorStartupTimeOutput = Readonly<{
  readonly startupTimeS: number;
}>;

export const calculateOscillatorStartupTime = (
  x: OscillatorStartupTimeInput,
): OscillatorStartupTimeOutput => {
  if (!Number.isFinite(x.initialAmplitudeV) || x.initialAmplitudeV < 0)
    simpleError("initialAmplitudeV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetAmplitudeV) || x.targetAmplitudeV < 0)
    simpleError("targetAmplitudeV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.growthTimeConstantS) || x.growthTimeConstantS < 0)
    simpleError("growthTimeConstantS", "Provide a finite number at least 0.");
  if (!(
    x.initialAmplitudeV > 0 &&
    x.targetAmplitudeV >= x.initialAmplitudeV &&
    x.growthTimeConstantS > 0
  ))
    simpleError(
      "input",
      "Target must be at least the positive initial amplitude and growth time constant must be positive.",
    );
  const startupTimeS =
    x.growthTimeConstantS * Math.log(x.targetAmplitudeV / x.initialAmplitudeV);
  if (!Number.isFinite(startupTimeS))
    simpleError("startupTimeS", "The inputs produce an invalid result.");
  return { startupTimeS: Object.is(startupTimeS, -0) ? 0 : startupTimeS };
};

export const example = {
  input: {
    initialAmplitudeV: 0.001,
    targetAmplitudeV: 1,
    growthTimeConstantS: 0.01,
  },
  output: { startupTimeS: 0.06907755278982138 },
} satisfies ToolExample<
  OscillatorStartupTimeInput,
  OscillatorStartupTimeOutput
>;

export const tool = createSimpleTool({
  id: "electronics/oscillator-startup-time",
  title: "Oscillator Startup Time",
  description:
    "Estimate time for an exponentially growing oscillator amplitude to reach a target amplitude from an initial noise seed and growth time constant.",
  inputs: [
    {
      id: "initialAmplitudeV",
      kind: "number",
      label: "Initial amplitude",
      unit: "V",
      minimum: 0,
    },
    {
      id: "targetAmplitudeV",
      kind: "number",
      label: "Target amplitude",
      unit: "V",
      minimum: 0,
    },
    {
      id: "growthTimeConstantS",
      kind: "number",
      label: "Amplitude growth time constant",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "startupTimeS",
      kind: "number",
      label: "Estimated startup time",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateOscillatorStartupTime({
      initialAmplitudeV: input.initialAmplitudeV as number,
      targetAmplitudeV: input.targetAmplitudeV as number,
      growthTimeConstantS: input.growthTimeConstantS as number,
    }),
});
export const oscillatorStartupTimeTool = tool;
export const runOscillatorStartupTime = tool.execute;
export default tool;
