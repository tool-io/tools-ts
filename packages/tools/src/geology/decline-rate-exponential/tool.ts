import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeclineRateExponentialInput = {
  readonly initialRateM3PerS: number;
  readonly declineRatePerS: number;
  readonly elapsedSeconds: number;
};

export type DeclineRateExponentialOutput = {
  readonly rateAfterElapsedM3PerS: number;
  readonly cumulativeProductionSm3: number;
};

export const calculateDeclineRateExponential = (
  input: DeclineRateExponentialInput,
): DeclineRateExponentialOutput => {
  const { initialRateM3PerS, declineRatePerS, elapsedSeconds } = input;
  if (!(initialRateM3PerS > 0))
    simpleError(
      "initialRateM3PerS",
      "Initial rate must be greater than zero.",
      "invalid_rate",
    );
  if (!(declineRatePerS > 0))
    simpleError(
      "declineRatePerS",
      "Decline rate must be greater than zero.",
      "invalid_rate",
    );
  if (!(elapsedSeconds > 0))
    simpleError(
      "elapsedSeconds",
      "Elapsed time must be greater than zero.",
      "invalid_time",
    );
  const rateAfterElapsedM3PerS =
    initialRateM3PerS * Math.exp(-declineRatePerS * elapsedSeconds);
  const cumulativeProductionSm3 =
    (initialRateM3PerS / declineRatePerS) *
    (1 - Math.exp(-declineRatePerS * elapsedSeconds));
  return { rateAfterElapsedM3PerS, cumulativeProductionSm3 };
};

export const declineRateExponentialExample = {
  input: {
    initialRateM3PerS: 0.02,
    declineRatePerS: 2e-8,
    elapsedSeconds: 31_536_000,
  },
  output: {
    rateAfterElapsedM3PerS: 0.010644169458496831,
    cumulativeProductionSm3: 467791.5270751585,
  },
} satisfies ToolExample<
  DeclineRateExponentialInput,
  DeclineRateExponentialOutput
>;

export const declineRateExponentialTool = createSimpleTool({
  id: "geology/decline-rate-exponential",
  title: "Decline Rate Exponential Calculator",
  description:
    "Evaluate the Arps exponential-decline production rate and cumulative production for a constant decline rate.",
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
      description: "Constant nominal decline rate D.",
      id: "declineRatePerS",
      kind: "number",
      label: "Decline rate",
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
    calculateDeclineRateExponential(
      input as unknown as DeclineRateExponentialInput,
    ),
});

export const runDeclineRateExponential = declineRateExponentialTool.execute;
export default declineRateExponentialTool;
