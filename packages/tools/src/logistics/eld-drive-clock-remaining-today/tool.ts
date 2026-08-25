import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EldDriveClockRemainingTodayInput = {
  readonly driveHoursUsedToday: number;
  readonly driveLimitHoursToday?: number;
};

export type EldDriveClockRemainingTodayOutput = {
  readonly driveHoursRemaining: number;
  readonly mustStopDriving: boolean;
};

export const calculateEldDriveClockRemainingToday = (
  input: EldDriveClockRemainingTodayInput,
): EldDriveClockRemainingTodayOutput => {
  const driveLimitHoursToday = input.driveLimitHoursToday ?? 11;
  if (
    !Number.isFinite(input.driveHoursUsedToday) ||
    input.driveHoursUsedToday < 0
  )
    return simpleError(
      "driveHoursUsedToday",
      "Driving hours used must be finite and non-negative.",
      "invalid_hours",
    );
  if (!Number.isFinite(driveLimitHoursToday) || driveLimitHoursToday <= 0)
    return simpleError(
      "driveLimitHoursToday",
      "The driving limit must be greater than zero.",
      "invalid_limit",
    );
  return {
    driveHoursRemaining: Math.max(
      0,
      driveLimitHoursToday - input.driveHoursUsedToday,
    ),
    mustStopDriving: input.driveHoursUsedToday >= driveLimitHoursToday,
  };
};

export const eldDriveClockRemainingTodayExample = {
  input: { driveHoursUsedToday: 7.75, driveLimitHoursToday: 11 },
  output: { driveHoursRemaining: 3.25, mustStopDriving: false },
} satisfies ToolExample<
  EldDriveClockRemainingTodayInput,
  EldDriveClockRemainingTodayOutput
>;

export const eldDriveClockRemainingTodayTool = createSimpleTool({
  id: "logistics/eld-drive-clock-remaining-today",
  title: "ELD Drive Clock Remaining Today Calculator",
  description:
    "Compare recorded driving time with a configurable daily driving limit and report the remaining clock. The 11-hour default is for the US property-carrying rule and does not evaluate every HOS condition or exception.",
  inputs: [
    {
      description: "Driving hours recorded today.",
      id: "driveHoursUsedToday",
      kind: "number",
      label: "Drive hours used",
      minimum: 0,
    },
    {
      default: 11,
      description:
        "Daily driving limit in hours (11 under the FMCSA property-carrying rule).",
      id: "driveLimitHoursToday",
      kind: "number",
      label: "Drive limit",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Driving hours left before the limit is reached.",
      id: "driveHoursRemaining",
      kind: "number",
      label: "Hours remaining",
    },
    {
      description: "Whether the driver must stop driving now.",
      id: "mustStopDriving",
      kind: "boolean",
      label: "Must stop",
    },
  ],
  calculate: (input) =>
    calculateEldDriveClockRemainingToday({
      driveHoursUsedToday: input.driveHoursUsedToday as number,
      driveLimitHoursToday: input.driveLimitHoursToday as number | undefined,
    }),
});

export const runEldDriveClockRemainingToday =
  eldDriveClockRemainingTodayTool.execute;
export default eldDriveClockRemainingTodayTool;
