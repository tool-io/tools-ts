import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sentId: string;
  readonly receivedId: string;
  readonly acknowledgmentRecorded: boolean;
};
export type Output = {
  readonly sameIdentifier: boolean;
  readonly acknowledgedMatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentId: { type: "string", maxLength: 8192, minLength: 1 },
    receivedId: { type: "string", maxLength: 8192, minLength: 1 },
    acknowledgmentRecorded: { type: "boolean" },
  },
  required: ["sentId", "receivedId", "acknowledgmentRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameIdentifier: { type: "boolean" },
    acknowledgedMatch: { type: "boolean" },
  },
  required: ["sameIdentifier", "acknowledgedMatch"],
} as const;
/** Compare explicit handoff message identifiers and acknowledgment flags without certifying clinical transfer completion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sentId, receivedId, acknowledgmentRecorded } = request;
  const compute = (): Output => {
    H.domain(sentId.length > 0 && receivedId.length > 0, "sentId");
    return {
      sameIdentifier: sentId === receivedId,
      acknowledgedMatch: acknowledgmentRecorded && sentId === receivedId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sentId: "H17", receivedId: "H17", acknowledgmentRecorded: true },
  output: { sameIdentifier: true, acknowledgedMatch: true },
} satisfies ToolExample<Input, Output>;
export const nursinghandoffAckReceiptTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/nursing-handoff-ack-receipt",
    title: "Nursing Handoff Acknowledgment Receipt",
    description:
      "Compare explicit handoff message identifiers and acknowledgment flags without certifying clinical transfer completion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sentId: { type: "string", maxLength: 8192, minLength: 1 },
        receivedId: { type: "string", maxLength: 8192, minLength: 1 },
        acknowledgmentRecorded: { type: "boolean" },
      },
      required: ["sentId", "receivedId", "acknowledgmentRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameIdentifier: { type: "boolean" },
        acknowledgedMatch: { type: "boolean" },
      },
      required: ["sameIdentifier", "acknowledgedMatch"],
    },
    ports: {
      inputs: [
        {
          id: "sentId",
          label: "Sent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "receivedId",
          label: "Received Id",
          required: true,
          valueType: { type: "string" },
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
          id: "sameIdentifier",
          label: "Same Identifier",
          valueType: { type: "boolean" },
        },
        {
          id: "acknowledgedMatch",
          label: "Acknowledged Match",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursinghandoffAckReceiptTool.execute;
export default nursinghandoffAckReceiptTool;
