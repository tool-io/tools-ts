import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeclineRateHarmonicInput = {
  readonly initialRateM3PerS: number;
  readonly initialDeclineRatePerS: number;
  readonly elapsedSeconds: number;
};

export type DeclineRateHarmonicOutput = {
  readonly rateAfterElapsedM3PerS: number;
  readonly cumulativeProductionSm3: number;
};

export const calculateDeclineRateHarmonic = (
  input: DeclineRateHarmonicInput,
): DeclineRateHarmonicOutput => {
  const { initialRateM3PerS, initialDeclineRatePerS, elapsedSeconds } = input;
  if (!(initialRateM3PerS > 0))
    simpleError(
      "initialRateM3PerS",
      "Initial rate must be greater than zero.",
      "invalid_rate",
    );
  if (!(initialDeclineRatePerS > 0))
    simpleError(
      "initialDeclineRatePerS",
      "Initial decline rate must be greater than zero.",
      "invalid_rate",
    );
  if (!(elapsedSeconds > 0))
    simpleError(
      "elapsedSeconds",
      "Elapsed time must be greater than zero.",
      "invalid_time",
    );
  const factor = 1 + initialDeclineRatePerS * elapsedSeconds;
  const rateAfterElapsedM3PerS = initialRateM3PerS / factor;
  const cumulativeProductionSm3 =
    (initialRateM3PerS / initialDeclineRatePerS) * Math.log(factor);
  return { rateAfterElapsedM3PerS, cumulativeProductionSm3 };
};

export const declineRateHarmonicExample = {
  input: {
    initialRateM3PerS: 0.02,
    initialDeclineRatePerS: 2e-8,
    elapsedSeconds: 31_536_000,
  },
  output: {
    rateAfterElapsedM3PerS: 0.01226452119309262,
    cumulativeProductionSm3: 489021.63508149754,
  },
} satisfies ToolExample<DeclineRateHarmonicInput, DeclineRateHarmonicOutput>;

export const declineRateHarmonicTool = createSimpleTool({
  id: "geology/decline-rate-harmonic",
  title: "Decline Rate Harmonic Calculator",
  description:
    "Evaluate the Arps harmonic-decline production rate and cumulative production for a unit decline exponent.",
  inputs: [
    {
      description: "Initial production rate.",
      id: "initialRateM3PerS",
      kind: "number",
      label: "Initial rate",
      minimum: 0,
      unit: "m3/s",
    },
    {
      description: "Nominal decline rate at initial conditions.",
      id: "initialDeclineRatePerS",
      kind: "number",
      label: "Initial decline",
      minimum: 0,
      unit: "1/s",
    },
    {
      description: "Producing time since the initial rate.",
      id: "elapsedSeconds",
      kind: "number",
      label: "Time",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Production rate after the elapsed time.",
      id: "rateAfterElapsedM3PerS",
      kind: "number",
      label: "Rate at time",
      unit: "m3/s",
    },
    {
      description: "Cumulative production over the elapsed time.",
      id: "cumulativeProductionSm3",
      kind: "number",
      label: "Cumulative production",
      unit: "m3",
    },
  ],
  calculate: (input) =>
    calculateDeclineRateHarmonic(input as unknown as DeclineRateHarmonicInput),
});

export const runDeclineRateHarmonic = declineRateHarmonicTool.execute;
export default declineRateHarmonicTool;
