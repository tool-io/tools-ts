import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedChannel: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedChannel: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedChannel", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly selected outreach channel and preference source without establishing channel safety or sending messages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedChannel, preferenceSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedChannel.length > 0, "suppliedChannel");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([recordId, suppliedChannel, preferenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedChannel: "text",
    preferenceSource: "Client form",
  },
  output: { token: '["R17","text","Client form"]' },
} satisfies ToolExample<Input, Output>;
export const outreachSafeChannelChoiceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["social-work", "social work", "social sciences"],
      keywords: ["social work", "social sciences"],
    },
    id: "social-work/outreach-safe-channel-choice-token",
    title: "Outreach Safe Channel Choice Token",
    description:
      "Preserve an explicitly selected outreach channel and preference source without establishing channel safety or sending messages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedChannel: { type: "string", maxLength: 8192, minLength: 1 },
        preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedChannel", "preferenceSource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedChannel",
          label: "Supplied Channel",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preferenceSource",
          label: "Preference Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = outreachSafeChannelChoiceTokenTool.execute;
export default outreachSafeChannelChoiceTokenTool;
