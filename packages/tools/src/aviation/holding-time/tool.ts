import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type HoldingTimeInput = {
  readonly inboundLegMinutes?: number;
  readonly turnRateDegPerS?: number;
};

export type HoldingTimeOutput = {
  readonly circuitMinutes: number;
};

export const holdingTimeExample = {
  input: { inboundLegMinutes: 1, turnRateDegPerS: 3 },
  output: { circuitMinutes: 4 },
} satisfies ToolExample<HoldingTimeInput, HoldingTimeOutput>;

export const calculateHoldingCircuitMinutes = (
  input: HoldingTimeInput,
): HoldingTimeOutput => {
  const leg = input.inboundLegMinutes ?? 1;
  const rate = input.turnRateDegPerS ?? 3;
  if (leg <= 0 || leg > 10)
    simpleError(
      "inboundLegMinutes",
      "The inbound leg must be between zero and ten minutes.",
      "invalid_leg",
    );
  if (rate <= 0 || rate > 360)
    simpleError(
      "turnRateDegPerS",
      "The turn rate must be between zero and 360 degrees per second.",
      "invalid_rate",
    );
  // Two legs plus two 180-degree turns flown at the given turn rate.
  const circuit = 2 * leg + (2 * (180 / rate)) / 60;
  return { circuitMinutes: roundStatistic(circuit) };
};

export const holdingTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateHoldingCircuitMinutes(input as unknown as HoldingTimeInput),
  description:
    "Compute the total time of one complete holding pattern circuit from the inbound leg time and turn rate.",
  id: "aviation/holding-time",
  inputs: [
    {
      description:
        "Inbound leg time; one minute below 14,000 feet is standard.",
      id: "inboundLegMinutes",
      kind: "number",
      label: "Inbound leg",
      unit: "min",
    },
    {
      default: 3,
      description:
        "Turn rate during the holding turns; three degrees per second is standard.",
      id: "turnRateDegPerS",
      kind: "number",
      label: "Turn rate",
      unit: "°/s",
    },
  ],
  outputs: [
    {
      description: "Total time for one full holding circuit.",
      format: "duration-min",
      id: "circuitMinutes",
      kind: "number",
      label: "Circuit time",
      unit: "min",
    },
  ],
  title: "Holding Pattern Time Calculator",
});
export const runHoldingTime = holdingTimeTool.execute;
export default holdingTimeTool;
