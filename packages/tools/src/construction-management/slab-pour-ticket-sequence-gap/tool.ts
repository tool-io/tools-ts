import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousTicket: number;
  readonly currentTicket: number;
};
export type Output = { readonly missingBetween: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousTicket: { type: "integer", minimum: 0 },
    currentTicket: { type: "integer" },
  },
  required: ["previousTicket", "currentTicket"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missingBetween: { type: "integer" } },
  required: ["missingBetween"],
} as const;
/** Count integer ticket numbers strictly between two supplied increasing pour-ticket sequence numbers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousTicket, currentTicket } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousTicket) &&
        previousTicket >= 0 &&
        previousTicket <= Number.MAX_SAFE_INTEGER,
      "previousTicket",
    ),
      previousTicket);
    (H.domain(
      Number.isSafeInteger(currentTicket) &&
        currentTicket >= previousTicket + 1 &&
        currentTicket <= Number.MAX_SAFE_INTEGER,
      "currentTicket",
    ),
      currentTicket);
    return { missingBetween: Math.max(0, currentTicket - previousTicket - 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousTicket: 17, currentTicket: 21 },
  output: { missingBetween: 3 },
} satisfies ToolExample<Input, Output>;
export const slabPourTicketSequenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/slab-pour-ticket-sequence-gap",
    title: "Slab Pour Ticket Sequence Gap",
    description:
      "Count integer ticket numbers strictly between two supplied increasing pour-ticket sequence numbers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousTicket: { type: "integer", minimum: 0 },
        currentTicket: { type: "integer" },
      },
      required: ["previousTicket", "currentTicket"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missingBetween: { type: "integer" } },
      required: ["missingBetween"],
    },
    ports: {
      inputs: [
        {
          id: "previousTicket",
          label: "Previous Ticket",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentTicket",
          label: "Current Ticket",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "missingBetween",
          label: "Missing Between",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = slabPourTicketSequenceGapTool.execute;
export default slabPourTicketSequenceGapTool;
