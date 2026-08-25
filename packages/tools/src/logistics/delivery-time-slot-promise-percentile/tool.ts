import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeliveryTimeSlotPromisePercentileInput = {
  readonly deliveryTimesMinutes: readonly number[];
  readonly promisePercentile?: number;
};

export type DeliveryTimeSlotPromisePercentileOutput = {
  readonly promisedSlotMinutes: number;
  readonly sampleCount: number;
  readonly slowestMinutes: number;
};

export const calculateDeliveryTimeSlotPromisePercentile = (
  input: DeliveryTimeSlotPromisePercentileInput,
): DeliveryTimeSlotPromisePercentileOutput => {
  const times = [...input.deliveryTimesMinutes];
  const percentile = input.promisePercentile ?? 95;
  if (times.length === 0)
    return simpleError(
      "deliveryTimesMinutes",
      "At least one delivery time is required.",
      "empty_sample",
    );
  if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100)
    return simpleError(
      "promisePercentile",
      "Promise percentile must be between zero and one hundred.",
      "invalid_percentile",
    );
  for (let index = 0; index < times.length; index += 1) {
    if (!Number.isFinite(times[index]) || times[index] < 0)
      return simpleError(
        "deliveryTimesMinutes",
        `Delivery time at index ${index} must be finite and non-negative.`,
        "invalid_duration",
      );
  }
  times.sort((a, b) => a - b);
  const rank = ((times.length - 1) * percentile) / 100;
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  const promisedSlotMinutes =
    times[lower] + (rank - lower) * (times[upper] - times[lower]);
  if (!Number.isFinite(promisedSlotMinutes))
    return simpleError(
      "deliveryTimesMinutes",
      "The percentile result is outside the representable range.",
      "percentile_out_of_range",
    );
  return {
    promisedSlotMinutes,
    sampleCount: times.length,
    slowestMinutes: times[times.length - 1],
  };
};

export const deliveryTimeSlotPromisePercentileExample = {
  input: {
    deliveryTimesMinutes: [38, 52, 41, 67, 45, 49, 58, 44],
    promisePercentile: 95,
  },
  output: { promisedSlotMinutes: 63.85, sampleCount: 8, slowestMinutes: 67 },
} satisfies ToolExample<
  DeliveryTimeSlotPromisePercentileInput,
  DeliveryTimeSlotPromisePercentileOutput
>;

export const deliveryTimeSlotPromisePercentileTool = createSimpleTool({
  id: "logistics/delivery-time-slot-promise-percentile",
  title: "Delivery Time Slot Promise Percentile",
  description:
    "Compute the p-th percentile (linear interpolation between closest ranks) of observed door-to-door delivery minutes to set a promised time slot that the fleet can keep.",
  inputs: [
    {
      description: "Observed delivery durations in minutes.",
      id: "deliveryTimesMinutes",
      kind: "numberList",
      label: "Delivery times",
    },
    {
      default: 95,
      description: "Percentile level to promise, 0-100.",
      id: "promisePercentile",
      kind: "number",
      label: "Percentile",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Promised slot length in minutes at the requested percentile.",
      id: "promisedSlotMinutes",
      kind: "number",
      label: "Promised slot",
      minimum: 0,
      unit: "min",
    },
    {
      description: "Number of observations used.",
      id: "sampleCount",
      kind: "integer",
      label: "Sample count",
    },
    {
      description: "Slowest observed delivery in minutes.",
      id: "slowestMinutes",
      kind: "number",
      label: "Slowest",
      minimum: 0,
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateDeliveryTimeSlotPromisePercentile({
      deliveryTimesMinutes: input.deliveryTimesMinutes as readonly number[],
      promisePercentile: input.promisePercentile as number | undefined,
    }),
});

export const runDeliveryTimeSlotPromisePercentile =
  deliveryTimeSlotPromisePercentileTool.execute;
export default deliveryTimeSlotPromisePercentileTool;
