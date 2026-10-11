import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ticketId: string;
  readonly knownTicketIds: readonly string[];
  readonly knownStatuses: readonly string[];
  readonly suppliedStatus: string;
};
export type Output = {
  readonly priorIdFound: boolean;
  readonly sameStatusFound: boolean;
  readonly conflictingStatusFound: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticketId: { type: "string", maxLength: 8192, minLength: 1 },
    knownTicketIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    knownStatuses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ticketId", "knownTicketIds", "knownStatuses", "suppliedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorIdFound: { type: "boolean" },
    sameStatusFound: { type: "boolean" },
    conflictingStatusFound: { type: "boolean" },
  },
  required: ["priorIdFound", "sameStatusFound", "conflictingStatusFound"],
} as const;
/** Compare an explicit public-service ticket status with supplied prior identifier-status records without merging tickets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ticketId, knownTicketIds, knownStatuses, suppliedStatus } = request;
  const compute = (): Output => {
    H.domain(ticketId.length > 0 && suppliedStatus.length > 0, "ticketId");
    return (() => {
      H.domain(knownTicketIds.length === knownStatuses.length, "knownStatuses");
      return {
        priorIdFound: knownTicketIds.includes(ticketId),
        sameStatusFound: knownTicketIds.some(
          (id, index) =>
            id === ticketId && knownStatuses[index] === suppliedStatus,
        ),
        conflictingStatusFound: knownTicketIds.some(
          (id, index) =>
            id === ticketId && knownStatuses[index] !== suppliedStatus,
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ticketId: "T17",
    knownTicketIds: ["T17", "T18"],
    knownStatuses: ["open", "closed"],
    suppliedStatus: "closed",
  },
  output: {
    priorIdFound: true,
    sameStatusFound: false,
    conflictingStatusFound: true,
  },
} satisfies ToolExample<Input, Output>;
export const publicServiceTicketDuplicateStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/public-service-ticket-duplicate-status",
    title: "Public Service Ticket Duplicate Status",
    description:
      "Compare an explicit public-service ticket status with supplied prior identifier-status records without merging tickets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ticketId: { type: "string", maxLength: 8192, minLength: 1 },
        knownTicketIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        knownStatuses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedStatus: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "ticketId",
        "knownTicketIds",
        "knownStatuses",
        "suppliedStatus",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorIdFound: { type: "boolean" },
        sameStatusFound: { type: "boolean" },
        conflictingStatusFound: { type: "boolean" },
      },
      required: ["priorIdFound", "sameStatusFound", "conflictingStatusFound"],
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
          id: "knownTicketIds",
          label: "Known Ticket Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "knownStatuses",
          label: "Known Statuses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedStatus",
          label: "Supplied Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "priorIdFound",
          label: "Prior Id Found",
          valueType: { type: "boolean" },
        },
        {
          id: "sameStatusFound",
          label: "Same Status Found",
          valueType: { type: "boolean" },
        },
        {
          id: "conflictingStatusFound",
          label: "Conflicting Status Found",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicServiceTicketDuplicateStatusTool.execute;
export default publicServiceTicketDuplicateStatusTool;
