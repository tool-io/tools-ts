import { parsePlainDate } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  SimpleToolError,
  simpleError,
} from "../../core/simple.js";

export type PartnerRotationInput = {
  readonly currentDate: string;
  readonly rotationOffDate: string;
  readonly requiredTimeOutYears: number;
};

export type PartnerRotationOutput = {
  readonly compliant: boolean;
  readonly elapsedCompleteYears: number;
  readonly eligibleDate: string;
  readonly remainingCompleteYears: number;
};

const formatPlainDate = (timestamp: number): string =>
  new Date(timestamp).toISOString().slice(0, 10);

const addCalendarYears = (timestamp: number, years: number): number => {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear() + years;
  const month = date.getUTCMonth();
  const day = Math.min(
    date.getUTCDate(),
    new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
  );
  return Date.UTC(year, month, day);
};

export const evaluatePartnerRotationTimeOut = (
  input: PartnerRotationInput,
): PartnerRotationOutput => {
  let currentTimestamp = 0;
  let rotationOffTimestamp = 0;
  try {
    currentTimestamp = parsePlainDate(input.currentDate, "currentDate");
    rotationOffTimestamp = parsePlainDate(
      input.rotationOffDate,
      "rotationOffDate",
    );
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(error.field, error.message, "invalid_rotation_date");
    throw error;
  }
  if (currentTimestamp < rotationOffTimestamp)
    simpleError(
      "rotationOffDate",
      "The rotation-off date must not be after the current date.",
      "invalid_rotation_date",
    );
  if (
    !Number.isSafeInteger(input.requiredTimeOutYears) ||
    input.requiredTimeOutYears <= 0
  )
    simpleError(
      "requiredTimeOutYears",
      "Required time-out years must be a positive whole number.",
      "invalid_time_out_requirement",
    );

  const eligibleTimestamp = addCalendarYears(
    rotationOffTimestamp,
    input.requiredTimeOutYears,
  );
  let elapsedCompleteYears =
    new Date(currentTimestamp).getUTCFullYear() -
    new Date(rotationOffTimestamp).getUTCFullYear();
  if (
    addCalendarYears(rotationOffTimestamp, elapsedCompleteYears) >
    currentTimestamp
  )
    elapsedCompleteYears -= 1;

  return {
    compliant: currentTimestamp >= eligibleTimestamp,
    elapsedCompleteYears,
    eligibleDate: formatPlainDate(eligibleTimestamp),
    remainingCompleteYears: Math.max(
      0,
      input.requiredTimeOutYears - elapsedCompleteYears,
    ),
  };
};

export const partnerRotationExample = {
  input: {
    currentDate: "2026-09-24",
    rotationOffDate: "2021-09-24",
    requiredTimeOutYears: 5,
  },
  output: {
    compliant: true,
    elapsedCompleteYears: 5,
    eligibleDate: "2026-09-24",
    remainingCompleteYears: 0,
  },
} satisfies ToolExample<PartnerRotationInput, PartnerRotationOutput>;

export const partnerRotationTool = createSimpleTool({
  calculate: (input) =>
    evaluatePartnerRotationTimeOut({
      currentDate: input.currentDate as string,
      rotationOffDate: input.rotationOffDate as string,
      requiredTimeOutYears: input.requiredTimeOutYears as number,
    }),
  description:
    "Check whether a caller-supplied audit-partner time-out period has elapsed using calendar-year anniversaries. Select the applicable period from the governing jurisdiction and partner role before using the result.",
  id: "auditing/partner-rotation-time-out-period-checker",
  inputs: [
    { id: "currentDate", kind: "string", label: "Current date" },
    { id: "rotationOffDate", kind: "string", label: "Rotation-off date" },
    {
      description:
        "Positive whole-number time-out period required by the applicable rule.",
      id: "requiredTimeOutYears",
      kind: "integer",
      label: "Required time-out years",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "compliant", kind: "boolean", label: "Time-out period met" },
    {
      id: "elapsedCompleteYears",
      kind: "integer",
      label: "Elapsed complete years",
      minimum: 0,
    },
    { id: "eligibleDate", kind: "string", label: "Earliest eligible date" },
    {
      id: "remainingCompleteYears",
      kind: "integer",
      label: "Remaining complete years",
      minimum: 0,
    },
  ],
  title: "Audit Partner Rotation Time-Out Period Checker",
});

export const runPartnerRotation = partnerRotationTool.execute;
export default partnerRotationTool;
