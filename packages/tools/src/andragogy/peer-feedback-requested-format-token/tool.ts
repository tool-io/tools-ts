import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestId: string;
  readonly requestedFormat: string;
  readonly recipientId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestId: { type: "string", maxLength: 8192, minLength: 1 },
    requestedFormat: { type: "string", maxLength: 8192, minLength: 1 },
    recipientId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["requestId", "requestedFormat", "recipientId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicit peer-feedback request format and recipient without selecting accessibility preferences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestId, requestedFormat, recipientId } = request;
  const compute = (): Output => {
    H.domain(requestId.length > 0, "requestId");
    H.domain(requestedFormat.length > 0, "requestedFormat");
    H.domain(recipientId.length > 0, "recipientId");
    return { token: JSON.stringify([requestId, requestedFormat, recipientId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestId: "R17", requestedFormat: "written", recipientId: "L4" },
  output: { token: '["R17","written","L4"]' },
} satisfies ToolExample<Input, Output>;
export const peerFeedbackRequestedFormatTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/peer-feedback-requested-format-token",
    title: "Peer Feedback Requested Format Token",
    description:
      "Encode an explicit peer-feedback request format and recipient without selecting accessibility preferences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestId: { type: "string", maxLength: 8192, minLength: 1 },
        requestedFormat: { type: "string", maxLength: 8192, minLength: 1 },
        recipientId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["requestId", "requestedFormat", "recipientId"],
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
          id: "requestId",
          label: "Request Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestedFormat",
          label: "Requested Format",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recipientId",
          label: "Recipient Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = peerFeedbackRequestedFormatTokenTool.execute;
export default peerFeedbackRequestedFormatTokenTool;
