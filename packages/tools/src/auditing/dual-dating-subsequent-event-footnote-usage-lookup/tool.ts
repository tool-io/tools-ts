import { parsePlainDate } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  SimpleToolError,
  simpleError,
} from "../../core/simple.js";

export type SubsequentEventDateInput = {
  readonly dualDated: boolean;
  readonly eventDate: string;
  readonly eventType:
    | "adjusting_subsequent"
    | "nonadjusting_subsequent"
    | "recognized_subsequent";
  readonly financialStatementDate: string;
  readonly notesDisclosed: boolean;
};

export type SubsequentEventDateOutput = {
  readonly chronologyValid: boolean;
  readonly disclosureSatisfied: boolean;
  readonly dualDateRequired: boolean;
  readonly dualDateSatisfied: boolean;
  readonly treatment: SubsequentEventDateInput["eventType"];
};

export const classifySubsequentEventDates = (
  input: SubsequentEventDateInput,
): SubsequentEventDateOutput => {
  if (
    ![
      "adjusting_subsequent",
      "nonadjusting_subsequent",
      "recognized_subsequent",
    ].includes(input.eventType)
  )
    simpleError(
      "eventType",
      "Subsequent-event type is invalid.",
      "invalid_event_type",
    );
  for (const field of ["dualDated", "notesDisclosed"] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  let financialStatementTimestamp = 0;
  let eventTimestamp = 0;
  try {
    financialStatementTimestamp = parsePlainDate(
      input.financialStatementDate,
      "financialStatementDate",
    );
    eventTimestamp = parsePlainDate(input.eventDate, "eventDate");
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(error.field, error.message, "invalid_event_date");
    throw error;
  }
  const dualDateRequired = input.eventType === "adjusting_subsequent";
  return {
    chronologyValid: eventTimestamp >= financialStatementTimestamp,
    disclosureSatisfied:
      input.eventType !== "nonadjusting_subsequent" || input.notesDisclosed,
    dualDateRequired,
    dualDateSatisfied: !dualDateRequired || input.dualDated,
    treatment: input.eventType,
  };
};

export const subsequentEventDateExample = {
  input: {
    dualDated: true,
    eventDate: "2026-02-10",
    eventType: "adjusting_subsequent",
    financialStatementDate: "2026-01-31",
    notesDisclosed: false,
  },
  output: {
    chronologyValid: true,
    disclosureSatisfied: true,
    dualDateRequired: true,
    dualDateSatisfied: true,
    treatment: "adjusting_subsequent",
  },
} satisfies ToolExample<SubsequentEventDateInput, SubsequentEventDateOutput>;

export const subsequentEventDateTool = createSimpleTool({
  calculate: (input) =>
    classifySubsequentEventDates({
      dualDated: input.dualDated as boolean,
      eventDate: input.eventDate as string,
      eventType: input.eventType as SubsequentEventDateInput["eventType"],
      financialStatementDate: input.financialStatementDate as string,
      notesDisclosed: input.notesDisclosed as boolean,
    }),
  description:
    "Check subsequent-event chronology, dual dating for supplied adjusting events, and note disclosure for supplied nonadjusting events.",
  id: "auditing/dual-dating-subsequent-event-footnote-usage-lookup",
  inputs: [
    {
      id: "dualDated",
      kind: "boolean",
      label: "Financial statements dual dated",
    },
    { id: "eventDate", kind: "string", label: "Event date" },
    {
      enum: [
        "adjusting_subsequent",
        "nonadjusting_subsequent",
        "recognized_subsequent",
      ],
      id: "eventType",
      kind: "string",
      label: "Event type",
    },
    {
      id: "financialStatementDate",
      kind: "string",
      label: "Financial statement date",
    },
    {
      id: "notesDisclosed",
      kind: "boolean",
      label: "Event disclosed in notes",
    },
  ],
  outputs: [
    { id: "chronologyValid", kind: "boolean", label: "Event chronology valid" },
    {
      id: "disclosureSatisfied",
      kind: "boolean",
      label: "Disclosure requirement satisfied",
    },
    { id: "dualDateRequired", kind: "boolean", label: "Dual date required" },
    { id: "dualDateSatisfied", kind: "boolean", label: "Dual date satisfied" },
    {
      enum: [
        "adjusting_subsequent",
        "nonadjusting_subsequent",
        "recognized_subsequent",
      ],
      id: "treatment",
      kind: "string",
      label: "Event treatment",
    },
  ],
  title: "Dual Dating Subsequent Event Footnote Usage Lookup",
});

export const runSubsequentEventDate = subsequentEventDateTool.execute;
export default subsequentEventDateTool;
