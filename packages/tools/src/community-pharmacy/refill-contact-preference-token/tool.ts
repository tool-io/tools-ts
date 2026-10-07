import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly contactMethod: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    contactMethod: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "contactMethod", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit refill contact preference and source without sending a message. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, contactMethod, preferenceSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(contactMethod.length > 0, "contactMethod");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([recordId, contactMethod, preferenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    contactMethod: "text",
    preferenceSource: "Patient form",
  },
  output: { token: '["R17","text","Patient form"]' },
} satisfies ToolExample<Input, Output>;
export const refillContactPreferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["community-pharmacy", "community pharmacy", "pharmacy"],
      keywords: ["community pharmacy", "pharmacy"],
    },
    id: "community-pharmacy/refill-contact-preference-token",
    title: "Refill Contact Preference Token",
    description:
      "Record an explicit refill contact preference and source without sending a message.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        contactMethod: { type: "string", maxLength: 8192, minLength: 1 },
        preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "contactMethod", "preferenceSource"],
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
          id: "contactMethod",
          label: "Contact Method",
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
export const run = refillContactPreferenceTokenTool.execute;
export default refillContactPreferenceTokenTool;
