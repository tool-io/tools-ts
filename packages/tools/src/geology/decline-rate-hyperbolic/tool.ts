import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeclineRateHyperbolicInput = {
  readonly initialRateM3PerS: number;
  readonly initialDeclineRatePerS: number;
  readonly declineExponent?: number;
  readonly elapsedSeconds: number;
};

export type DeclineRateHyperbolicOutput = {
  readonly rateAfterElapsedM3PerS: number;
  readonly cumulativeProductionSm3: number;
};

export const calculateDeclineRateHyperbolic = (
  input: DeclineRateHyperbolicInput,
): DeclineRateHyperbolicOutput => {
  const { initialRateM3PerS, initialDeclineRatePerS, elapsedSeconds } = input;
  const exponent = input.declineExponent ?? 0.5;
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
  if (!(exponent > 0 && exponent < 1))
    simpleError(
      "declineExponent",
      "Hyperbolic exponent must lie strictly between zero and one.",
      "invalid_exponent",
    );
  if (!(elapsedSeconds > 0))
    simpleError(
      "elapsedSeconds",
      "Elapsed time must be greater than zero.",
      "invalid_time",
    );
  const factor = 1 + exponent * initialDeclineRatePerS * elapsedSeconds;
  const rateAfterElapsedM3PerS =
    initialRateM3PerS / Math.pow(factor, 1 / exponent);
  const cumulativeProductionSm3 =
    (initialRateM3PerS / (initialDeclineRatePerS * (1 - exponent))) *
    (1 - Math.pow(factor, (exponent - 1) / exponent));
  return { rateAfterElapsedM3PerS, cumulativeProductionSm3 };
};

export const declineRateHyperbolicExample = {
  input: {
    initialRateM3PerS: 0.02,
    initialDeclineRatePerS: 2e-8,
    declineExponent: 0.5,
    elapsedSeconds: 31_536_000,
  },
  output: {
    rateAfterElapsedM3PerS: 0.011559544839352362,
    cumulativeProductionSm3: 479503.7100109476,
  },
} satisfies ToolExample<
  DeclineRateHyperbolicInput,
  DeclineRateHyperbolicOutput
>;

export const declineRateHyperbolicTool = createSimpleTool({
  id: "geology/decline-rate-hyperbolic",
  title: "Decline Rate Hyperbolic Calculator",
  description:
    "Evaluate the Arps hyperbolic-decline production rate and cumulative production for a decline exponent between zero and one.",
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
      default: 0.5,
      description: "Arps hyperbolic decline exponent b.",
      id: "declineExponent",
      kind: "number",
      label: "Exponent b",
      maximum: 1,
      minimum: 0,
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
    calculateDeclineRateHyperbolic(
      input as unknown as DeclineRateHyperbolicInput,
    ),
});

export const runDeclineRateHyperbolic = declineRateHyperbolicTool.execute;
export default declineRateHyperbolicTool;
