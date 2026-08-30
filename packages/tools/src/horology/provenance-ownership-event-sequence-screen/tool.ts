import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const parseDate = (value: string, field: string): Date => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    simpleError(
      field,
      "Dates must use YYYY-MM-DD format.",
      "date_format_invalid",
    );
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    simpleError(field, "Date is not a valid calendar date.", "date_invalid");
  return date;
};

export type ProvenanceSequenceInput = {
  readonly eventDates: readonly string[];
  readonly maximumAllowedGapDays: number;
};

export type ProvenanceSequenceOutput = {
  readonly dateRangeDays: number;
  readonly eventCount: number;
  readonly gapsDays: readonly number[];
  readonly maximumGapDays: number;
  readonly withinCallerGapLimit: boolean;
};

export const screenProvenanceOwnershipSequence = (
  input: ProvenanceSequenceInput,
): ProvenanceSequenceOutput => {
  if (input.eventDates.length < 2)
    simpleError(
      "eventDates",
      "At least two provenance event dates are required.",
      "insufficient_events",
    );
  if (
    !Number.isSafeInteger(input.maximumAllowedGapDays) ||
    input.maximumAllowedGapDays < 0
  )
    simpleError(
      "maximumAllowedGapDays",
      "Maximum gap must be a nonnegative safe integer in days.",
      "gap_limit_invalid",
    );
  const dates = input.eventDates.map((value) => parseDate(value, "eventDates"));
  for (let index = 1; index < dates.length; index += 1) {
    const previousDate = dates[index - 1];
    const currentDate = dates[index];
    if (previousDate === undefined || currentDate === undefined)
      simpleError(
        "eventDates",
        "Provenance event dates are incomplete.",
        "event_missing",
      );
    if (currentDate.getTime() < previousDate.getTime())
      simpleError(
        "eventDates",
        "Event dates must be in nondecreasing chronological order.",
        "events_out_of_order",
      );
  }
  const gapsDays = dates.slice(1).map((date, index) => {
    const previousDate = dates[index];
    if (previousDate === undefined)
      simpleError(
        "eventDates",
        "Provenance event dates are incomplete.",
        "event_missing",
      );
    return Math.floor((date.getTime() - previousDate.getTime()) / 86_400_000);
  });
  const maximumGapDays = Math.max(...gapsDays);
  const firstDate =
    dates[0] ??
    simpleError(
      "eventDates",
      "At least two provenance event dates are required.",
      "insufficient_events",
    );
  const lastDate =
    dates[dates.length - 1] ??
    simpleError(
      "eventDates",
      "At least two provenance event dates are required.",
      "insufficient_events",
    );
  return {
    dateRangeDays: Math.floor(
      (lastDate.getTime() - firstDate.getTime()) / 86_400_000,
    ),
    eventCount: dates.length,
    gapsDays,
    maximumGapDays,
    withinCallerGapLimit: maximumGapDays <= input.maximumAllowedGapDays,
  };
};

export const provenanceSequenceExample = {
  input: {
    eventDates: ["2020-01-01", "2022-01-01", "2022-04-01"],
    maximumAllowedGapDays: 730,
  },
  output: {
    dateRangeDays: 821,
    eventCount: 3,
    gapsDays: [731, 90],
    maximumGapDays: 731,
    withinCallerGapLimit: false,
  },
} satisfies ToolExample<ProvenanceSequenceInput, ProvenanceSequenceOutput>;

export const provenanceSequenceTool = createSimpleTool({
  calculate: (input) =>
    screenProvenanceOwnershipSequence({
      eventDates: input.eventDates as string[],
      maximumAllowedGapDays: input.maximumAllowedGapDays as number,
    }),
  description:
    "Validate chronological provenance-event dates and screen their documentary gaps against an explicit maximum; it does not establish legal ownership or authenticity.",
  id: "horology/provenance-ownership-event-sequence-screen",
  inputs: [
    {
      description:
        "Dates must use YYYY-MM-DD and be supplied in chronological order.",
      id: "eventDates",
      kind: "stringList",
      label: "Provenance event dates",
    },
    {
      id: "maximumAllowedGapDays",
      kind: "integer",
      label: "Maximum allowed documentary gap",
      minimum: 0,
      unit: "d",
    },
  ],
  outputs: [
    {
      id: "dateRangeDays",
      kind: "integer",
      label: "First-to-last event range",
      minimum: 0,
      unit: "d",
    },
    { id: "eventCount", kind: "integer", label: "Event count", minimum: 2 },
    {
      id: "gapsDays",
      kind: "numberList",
      label: "Inter-event gaps",
      unit: "d",
    },
    {
      id: "maximumGapDays",
      kind: "integer",
      label: "Maximum inter-event gap",
      minimum: 0,
      unit: "d",
    },
    {
      id: "withinCallerGapLimit",
      kind: "boolean",
      label: "Within caller gap limit",
    },
  ],
  title: "Provenance Ownership Event Sequence Screen",
});

export const runProvenanceSequence = provenanceSequenceTool.execute;
export default provenanceSequenceTool;
