import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TorqueDecayCurveInput = {
  readonly elapsedHours: ReadonlyArray<number>;
  readonly readoutHour: number;
  readonly torqueValues: ReadonlyArray<number>;
};

export type TorqueDecayCurveOutput = {
  readonly averageDeclinePerHour: number;
  readonly interpolatedTorque: number;
  readonly monotonicDecreasing: boolean;
  readonly remainingTorqueRatio: number;
};

export const readPowerReserveTorqueDecayCurve = (
  input: TorqueDecayCurveInput,
): TorqueDecayCurveOutput => {
  if (!Array.isArray(input.elapsedHours) || !Array.isArray(input.torqueValues))
    simpleError(
      "",
      "Elapsed hours and torque values must be arrays.",
      "curve_data_required",
    );
  if (
    input.elapsedHours.length < 2 ||
    input.elapsedHours.length !== input.torqueValues.length
  )
    simpleError(
      "torqueValues",
      "At least two matching curve points are required.",
      "curve_length_mismatch",
    );
  const missingCurvePoint = (): never =>
    simpleError(
      "torqueValues",
      "At least two matching curve points are required.",
      "curve_length_mismatch",
    );
  const firstHour = input.elapsedHours[0] ?? missingCurvePoint();
  const firstTorque = input.torqueValues[0] ?? missingCurvePoint();
  const lastHour =
    input.elapsedHours[input.elapsedHours.length - 1] ?? missingCurvePoint();
  const lastTorque =
    input.torqueValues[input.torqueValues.length - 1] ?? missingCurvePoint();
  for (const [index, hour] of input.elapsedHours.entries()) {
    const previousHour = input.elapsedHours[index - 1];
    const torque = input.torqueValues[index];
    if (
      !Number.isFinite(hour) ||
      hour < 0 ||
      (index > 0 && (previousHour === undefined || hour <= previousHour))
    )
      simpleError(
        `elapsedHours.${index}`,
        "Elapsed hours must be finite, nonnegative, and strictly increasing.",
        "invalid_elapsed_hour",
      );
    if (!Number.isFinite(torque) || torque === undefined || torque < 0)
      simpleError(
        `torqueValues.${index}`,
        "Torque values must be finite and nonnegative.",
        "invalid_torque",
      );
  }
  if (firstTorque === 0)
    simpleError(
      "torqueValues.0",
      "Starting torque must be greater than zero.",
      "zero_starting_torque",
    );
  if (
    !Number.isFinite(input.readoutHour) ||
    input.readoutHour < firstHour ||
    input.readoutHour > lastHour
  )
    simpleError(
      "readoutHour",
      "Readout hour must lie within the measured curve interval.",
      "readout_hour_out_of_range",
    );
  let interpolatedTorque: number;
  if (input.readoutHour === firstHour) interpolatedTorque = firstTorque;
  else if (input.readoutHour === lastHour) interpolatedTorque = lastTorque;
  else {
    const segmentIndex = input.elapsedHours.findIndex(
      (hour, index) => index > 0 && input.readoutHour <= hour,
    );
    const startHour = input.elapsedHours[segmentIndex - 1];
    const endHour = input.elapsedHours[segmentIndex];
    const startTorque = input.torqueValues[segmentIndex - 1];
    const endTorque = input.torqueValues[segmentIndex];
    if (
      startHour === undefined ||
      endHour === undefined ||
      startTorque === undefined ||
      endTorque === undefined
    )
      simpleError(
        "readoutHour",
        "Readout hour does not have a complete interpolation segment.",
        "curve_segment_missing",
      );
    const fraction = (input.readoutHour - startHour) / (endHour - startHour);
    interpolatedTorque = startTorque + fraction * (endTorque - startTorque);
  }
  return {
    averageDeclinePerHour: (firstTorque - lastTorque) / (lastHour - firstHour),
    interpolatedTorque,
    monotonicDecreasing: input.torqueValues.every((torque, index) => {
      const previousTorque = input.torqueValues[index - 1];
      return (
        index === 0 ||
        (previousTorque !== undefined && torque <= previousTorque)
      );
    }),
    remainingTorqueRatio: lastTorque / firstTorque,
  };
};

export const torqueDecayCurveExample = {
  input: {
    elapsedHours: [0, 5, 10],
    readoutHour: 7.5,
    torqueValues: [10, 6, 5],
  },
  output: {
    averageDeclinePerHour: 0.5,
    interpolatedTorque: 5.5,
    monotonicDecreasing: true,
    remainingTorqueRatio: 0.5,
  },
} satisfies ToolExample<TorqueDecayCurveInput, TorqueDecayCurveOutput>;

export const torqueDecayCurveTool = createSimpleTool({
  calculate: (input) =>
    readPowerReserveTorqueDecayCurve({
      elapsedHours: input.elapsedHours as number[],
      readoutHour: input.readoutHour as number,
      torqueValues: input.torqueValues as number[],
    }),
  description:
    "Linearly interpolate torque on a caller-supplied measured curve and report its decline, ratio, and monotonicity.",
  id: "horology/power-reserve-torque-decay-curve-reader",
  inputs: [
    {
      description: "At least two strictly increasing elapsed-hour values.",
      id: "elapsedHours",
      kind: "numberList",
      label: "Elapsed hours",
      unit: "h",
    },
    {
      id: "readoutHour",
      kind: "number",
      label: "Readout hour",
      minimum: 0,
      unit: "h",
    },
    {
      description: "Finite nonnegative torque value for each elapsed hour.",
      id: "torqueValues",
      kind: "numberList",
      label: "Torque values",
    },
  ],
  outputs: [
    {
      id: "averageDeclinePerHour",
      kind: "number",
      label: "Average decline per hour",
    },
    {
      id: "interpolatedTorque",
      kind: "number",
      label: "Interpolated torque",
      minimum: 0,
    },
    {
      id: "monotonicDecreasing",
      kind: "boolean",
      label: "Curve monotonically decreases",
    },
    {
      id: "remainingTorqueRatio",
      kind: "number",
      label: "Remaining-to-start torque ratio",
      minimum: 0,
    },
  ],
  title: "Power Reserve Torque Decay Curve Reader",
});

export const runTorqueDecayCurve = torqueDecayCurveTool.execute;
export default torqueDecayCurveTool;
