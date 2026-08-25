import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TravelTimeOrderPickerBatchInput = {
  readonly travelDistanceM: number;
  readonly walkingSpeedMps?: number;
  readonly pickLinesCompleted?: number;
  readonly averageSecondsPerPick?: number;
};

export type TravelTimeOrderPickerBatchOutput = {
  readonly travelTimeSeconds: number;
  readonly pickTimeSeconds: number;
  readonly totalTaskSeconds: number;
  readonly totalTaskMinutes: number;
};

export const calculateTravelTimeOrderPickerBatch = (
  input: TravelTimeOrderPickerBatchInput,
): TravelTimeOrderPickerBatchOutput => {
  if (!Number.isFinite(input.travelDistanceM) || input.travelDistanceM < 0)
    return simpleError(
      "travelDistanceM",
      "The travel distance must be finite and non-negative.",
      "invalid_distance",
    );
  const walkingSpeedMps = input.walkingSpeedMps ?? 1.2;
  if (!Number.isFinite(walkingSpeedMps) || walkingSpeedMps <= 0)
    return simpleError(
      "walkingSpeedMps",
      "The walking speed must be finite and greater than zero.",
      "invalid_speed",
    );
  const pickLinesCompleted = input.pickLinesCompleted ?? 0;
  if (!(Number.isSafeInteger(pickLinesCompleted) && pickLinesCompleted >= 0))
    return simpleError(
      "pickLinesCompleted",
      "The pick line count must be a whole number of zero or more.",
      "invalid_lines",
    );
  const averageSecondsPerPick = input.averageSecondsPerPick ?? 10;
  if (!Number.isFinite(averageSecondsPerPick) || averageSecondsPerPick <= 0)
    return simpleError(
      "averageSecondsPerPick",
      "The seconds per pick must be finite and greater than zero.",
      "invalid_rate",
    );
  const travelTimeSeconds = input.travelDistanceM / walkingSpeedMps;
  const pickTimeSeconds = pickLinesCompleted * averageSecondsPerPick;
  const totalTaskSeconds = travelTimeSeconds + pickTimeSeconds;
  if (
    !Number.isFinite(travelTimeSeconds) ||
    !Number.isFinite(pickTimeSeconds) ||
    !Number.isFinite(totalTaskSeconds) ||
    (input.travelDistanceM > 0 && travelTimeSeconds <= 0) ||
    (pickLinesCompleted > 0 && pickTimeSeconds <= 0)
  )
    return simpleError(
      "travelDistanceM",
      "The task duration is outside the representable range.",
      "duration_out_of_range",
    );
  const totalTaskMinutes = totalTaskSeconds / 60;
  if (totalTaskSeconds > 0 && totalTaskMinutes <= 0)
    return simpleError(
      "travelDistanceM",
      "The task duration in minutes is outside the representable range.",
      "duration_out_of_range",
    );
  return {
    travelTimeSeconds,
    pickTimeSeconds,
    totalTaskSeconds,
    totalTaskMinutes,
  };
};

export const travelTimeOrderPickerBatchExample = {
  input: {
    travelDistanceM: 320,
    walkingSpeedMps: 1.2,
    pickLinesCompleted: 60,
    averageSecondsPerPick: 9,
  },
  output: {
    travelTimeSeconds: 266.6666666666667,
    pickTimeSeconds: 540,
    totalTaskSeconds: 806.6666666666667,
    totalTaskMinutes: 13.444444444444446,
  },
} satisfies ToolExample<
  TravelTimeOrderPickerBatchInput,
  TravelTimeOrderPickerBatchOutput
>;

export const travelTimeOrderPickerBatchTool = createSimpleTool({
  id: "logistics/travel-time-order-picker-batch",
  title: "Travel Time Order Picker Batch",
  description:
    "Split a picker's batch task into travel time (distance over walking speed) and pick time (lines times seconds per line), with documented default speed and pick rate to override with measured values.",
  inputs: [
    {
      description: "Route length of the batch in metres.",
      id: "travelDistanceM",
      kind: "number",
      label: "Distance",
      minimum: 0,
      unit: "m",
    },
    {
      default: 1.2,
      description:
        "Walking speed in metres per second (planning default; replace it with your time-study value).",
      id: "walkingSpeedMps",
      kind: "number",
      label: "Speed",
      minimum: Number.MIN_VALUE,
      unit: "m/s",
    },
    {
      default: 0,
      description: "Pick lines completed on the batch.",
      id: "pickLinesCompleted",
      kind: "integer",
      label: "Lines",
      minimum: 0,
    },
    {
      default: 10,
      description:
        "Average handling seconds per pick line (planning default; replace it with your engineered standard).",
      id: "averageSecondsPerPick",
      kind: "number",
      label: "Sec/pick",
      minimum: Number.MIN_VALUE,
      unit: "s/pick",
    },
  ],
  outputs: [
    {
      description: "Travel component in seconds.",
      id: "travelTimeSeconds",
      kind: "number",
      label: "Travel",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Picking component in seconds.",
      id: "pickTimeSeconds",
      kind: "number",
      label: "Picking",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Total task time in seconds.",
      id: "totalTaskSeconds",
      kind: "number",
      label: "Total",
      minimum: 0,
      unit: "s",
    },
    {
      description: "Total task time in minutes.",
      id: "totalTaskMinutes",
      kind: "number",
      label: "Minutes",
      minimum: 0,
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateTravelTimeOrderPickerBatch({
      averageSecondsPerPick: input.averageSecondsPerPick as number | undefined,
      pickLinesCompleted: input.pickLinesCompleted as number | undefined,
      travelDistanceM: input.travelDistanceM as number,
      walkingSpeedMps: input.walkingSpeedMps as number | undefined,
    }),
});

export const runTravelTimeOrderPickerBatch =
  travelTimeOrderPickerBatchTool.execute;
export default travelTimeOrderPickerBatchTool;
