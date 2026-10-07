import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sentMessageId: string;
  readonly acknowledgedMessageId: string;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sentMessageId: { type: "string", maxLength: 8192, minLength: 1 },
    acknowledgedMessageId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sentMessageId", "acknowledgedMessageId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare explicit message and acknowledgment identifiers using exact text equality without sending messages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sentMessageId, acknowledgedMessageId } = request;
  const compute = (): Output => {
    H.domain(
      sentMessageId.length > 0 && acknowledgedMessageId.length > 0,
      "sentMessageId",
    );
    return { matches: sentMessageId === acknowledgedMessageId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sentMessageId: "MSG17", acknowledgedMessageId: "MSG17" },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const communicationAckMessageIdMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/communication-ack-message-id-match",
    title: "Communication Ack Message ID Match",
    description:
      "Compare explicit message and acknowledgment identifiers using exact text equality without sending messages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sentMessageId: { type: "string", maxLength: 8192, minLength: 1 },
        acknowledgedMessageId: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["sentMessageId", "acknowledgedMessageId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "sentMessageId",
          label: "Sent Message Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "acknowledgedMessageId",
          label: "Acknowledged Message Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = communicationAckMessageIdMatchTool.execute;
export default communicationAckMessageIdMatchTool;
