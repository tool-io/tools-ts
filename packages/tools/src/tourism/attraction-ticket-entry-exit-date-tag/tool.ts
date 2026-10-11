import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ticketId: string;
  readonly entryDateText: string;
  readonly exitDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticketId: { type: "string", maxLength: 8192, minLength: 1 },
    entryDateText: { type: "string", maxLength: 8192, minLength: 1 },
    exitDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ticketId", "entryDateText", "exitDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit attraction ticket entry and exit date wording without validating admission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ticketId, entryDateText, exitDateText } = request;
  const compute = (): Output => {
    H.domain(ticketId.length > 0, "ticketId");
    H.domain(entryDateText.length > 0, "entryDateText");
    H.domain(exitDateText.length > 0, "exitDateText");
    return { token: JSON.stringify([ticketId, entryDateText, exitDateText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ticketId: "T17",
    entryDateText: "2026-11-01",
    exitDateText: "2026-11-02",
  },
  output: { token: '["T17","2026-11-01","2026-11-02"]' },
} satisfies ToolExample<Input, Output>;
export const attractionTicketEntryExitDateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/attraction-ticket-entry-exit-date-tag",
    title: "Attraction Ticket Entry Exit Date Tag",
    description:
      "Preserve explicit attraction ticket entry and exit date wording without validating admission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ticketId: { type: "string", maxLength: 8192, minLength: 1 },
        entryDateText: { type: "string", maxLength: 8192, minLength: 1 },
        exitDateText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["ticketId", "entryDateText", "exitDateText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "ticketId",
          label: "Ticket Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "entryDateText",
          label: "Entry Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exitDateText",
          label: "Exit Date Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = attractionTicketEntryExitDateTagTool.execute;
export default attractionTicketEntryExitDateTagTool;
