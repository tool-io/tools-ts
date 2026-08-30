import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanBusLoadPercentageInput = Readonly<{
  readonly transmittedBits: number;
  readonly bitRateBitsPerS: number;
  readonly observationSeconds: number;
}>;
export type CanBusLoadPercentageOutput = Readonly<{
  readonly busLoadPercent: number;
}>;

export const calculateCanBusLoadPercentage = (
  x: CanBusLoadPercentageInput,
): CanBusLoadPercentageOutput => {
  if (!Number.isSafeInteger(x.transmittedBits) || x.transmittedBits < 0)
    simpleError("transmittedBits", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.bitRateBitsPerS) || x.bitRateBitsPerS < 0)
    simpleError("bitRateBitsPerS", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.observationSeconds) || x.observationSeconds < 0)
    simpleError("observationSeconds", "Provide a finite number at least 0.");
  if (!(
    x.bitRateBitsPerS > 0 &&
    x.observationSeconds > 0 &&
    x.transmittedBits <= x.bitRateBitsPerS * x.observationSeconds
  ))
    simpleError(
      "input",
      "Rate and duration must be positive and utilization cannot exceed 100%.",
    );
  const busLoadPercent =
    (100 * x.transmittedBits) / (x.bitRateBitsPerS * x.observationSeconds);
  if (!Number.isFinite(busLoadPercent))
    simpleError("busLoadPercent", "The inputs produce an invalid result.");
  return { busLoadPercent: Object.is(busLoadPercent, -0) ? 0 : busLoadPercent };
};

export const example = {
  input: {
    transmittedBits: 100000,
    bitRateBitsPerS: 500000,
    observationSeconds: 1,
  },
  output: { busLoadPercent: 20 },
} satisfies ToolExample<CanBusLoadPercentageInput, CanBusLoadPercentageOutput>;

export const tool = createSimpleTool({
  id: "electronics/can-bus-load-percentage",
  title: "CAN Bus Load Percentage",
  description:
    "Calculate measured CAN bus utilization from total transmitted on-wire bits, link bit rate, and observation duration; bit stuffing must already be counted.",
  inputs: [
    {
      id: "transmittedBits",
      kind: "integer",
      label: "Observed on-wire bits",
      unit: "bit",
      minimum: 0,
    },
    {
      id: "bitRateBitsPerS",
      kind: "number",
      label: "Bus bit rate",
      unit: "bit/s",
      minimum: 0,
    },
    {
      id: "observationSeconds",
      kind: "number",
      label: "Observation duration",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "busLoadPercent",
      kind: "number",
      label: "Measured bus load",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateCanBusLoadPercentage({
      transmittedBits: input.transmittedBits as number,
      bitRateBitsPerS: input.bitRateBitsPerS as number,
      observationSeconds: input.observationSeconds as number,
    }),
});
export const canBusLoadPercentageTool = tool;
export const runCanBusLoadPercentage = tool.execute;
export default tool;
