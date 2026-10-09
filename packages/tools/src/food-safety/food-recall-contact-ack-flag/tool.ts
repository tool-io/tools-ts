import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactId: string;
  readonly notificationRecorded: boolean;
  readonly acknowledgmentRecorded: boolean;
};
export type Output = { readonly awaitingAcknowledgment: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactId: { type: "string", maxLength: 8192, minLength: 1 },
    notificationRecorded: { type: "boolean" },
    acknowledgmentRecorded: { type: "boolean" },
  },
  required: ["contactId", "notificationRecorded", "acknowledgmentRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { awaitingAcknowledgment: { type: "boolean" } },
  required: ["awaitingAcknowledgment"],
} as const;
/** Combine explicit recall-notification and acknowledgment flags without sending messages or determining recall scope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactId, notificationRecorded, acknowledgmentRecorded } = request;
  const compute = (): Output => {
    H.domain(contactId.length > 0, "contactId");
    H.domain(
      notificationRecorded || !acknowledgmentRecorded,
      "acknowledgmentRecorded",
    );
    return {
      awaitingAcknowledgment: notificationRecorded && !acknowledgmentRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactId: "C17",
    notificationRecorded: true,
    acknowledgmentRecorded: false,
  },
  output: { awaitingAcknowledgment: true },
} satisfies ToolExample<Input, Output>;
export const foodRecallContactAckFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/food-recall-contact-ack-flag",
    title: "Food Recall Contact Ack Flag",
    description:
      "Combine explicit recall-notification and acknowledgment flags without sending messages or determining recall scope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactId: { type: "string", maxLength: 8192, minLength: 1 },
        notificationRecorded: { type: "boolean" },
        acknowledgmentRecorded: { type: "boolean" },
      },
      required: ["contactId", "notificationRecorded", "acknowledgmentRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { awaitingAcknowledgment: { type: "boolean" } },
      required: ["awaitingAcknowledgment"],
    },
    ports: {
      inputs: [
        {
          id: "contactId",
          label: "Contact Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "notificationRecorded",
          label: "Notification Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "acknowledgmentRecorded",
          label: "Acknowledgment Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "awaitingAcknowledgment",
          label: "Awaiting Acknowledgment",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodRecallContactAckFlagTool.execute;
export default foodRecallContactAckFlagTool;
