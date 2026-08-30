import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmplitudeDeclinePowerReserveInput = Readonly<{
  readonly startingAmplitudeDegrees: number;
  readonly endingAmplitudeDegrees: number;
  readonly elapsedHours: number;
}>;
export type AmplitudeDeclinePowerReserveOutput = Readonly<{
  readonly declineDegreesPerHour: number;
}>;

export const calculateAmplitudeDeclinePowerReserve = (
  x: AmplitudeDeclinePowerReserveInput,
): AmplitudeDeclinePowerReserveOutput => {
  if (
    !Number.isFinite(x.startingAmplitudeDegrees) ||
    x.startingAmplitudeDegrees <= 0
  )
    simpleError(
      "startingAmplitudeDegrees",
      "Provide a finite positive number.",
    );
  if (
    !Number.isFinite(x.endingAmplitudeDegrees) ||
    x.endingAmplitudeDegrees < 0
  )
    simpleError(
      "endingAmplitudeDegrees",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.elapsedHours) || x.elapsedHours <= 0)
    simpleError("elapsedHours", "Provide a finite positive number.");
  if (!(x.endingAmplitudeDegrees <= x.startingAmplitudeDegrees))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const declineDegreesPerHour =
    (x.startingAmplitudeDegrees - x.endingAmplitudeDegrees) / x.elapsedHours;
  if (!Number.isFinite(declineDegreesPerHour))
    simpleError(
      "declineDegreesPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    declineDegreesPerHour: Object.is(declineDegreesPerHour, -0)
      ? 0
      : declineDegreesPerHour,
  };
};

export const example = {
  input: {
    startingAmplitudeDegrees: 300,
    endingAmplitudeDegrees: 240,
    elapsedHours: 12,
  },
  output: { declineDegreesPerHour: 5 },
} satisfies ToolExample<
  AmplitudeDeclinePowerReserveInput,
  AmplitudeDeclinePowerReserveOutput
>;

export const tool = createSimpleTool({
  id: "horology/amplitude-decline-power-reserve",
  title: "Amplitude Decline Power Reserve",
  description:
    "Observed linear balance-amplitude decline in degrees per hour over a running interval.",
  inputs: [
    {
      id: "startingAmplitudeDegrees",
      kind: "number",
      label: "Starting Amplitude Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "endingAmplitudeDegrees",
      kind: "number",
      label: "Ending Amplitude Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed Hours",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "declineDegreesPerHour",
      kind: "number",
      label: "Decline Degrees Per Hour",
      unit: "deg/h",
    },
  ],
  calculate: (input) =>
    calculateAmplitudeDeclinePowerReserve({
      startingAmplitudeDegrees: input.startingAmplitudeDegrees as number,
      endingAmplitudeDegrees: input.endingAmplitudeDegrees as number,
      elapsedHours: input.elapsedHours as number,
    }),
});
export const amplitudeDeclinePowerReserveTool = tool;
export const runAmplitudeDeclinePowerReserve = tool.execute;
export default tool;
