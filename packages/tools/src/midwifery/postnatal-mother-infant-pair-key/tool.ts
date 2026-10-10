import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maternalRecordId: string;
  readonly infantRecordId: string;
  readonly contactId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maternalRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    infantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    contactId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["maternalRecordId", "infantRecordId", "contactId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit maternal/infant pair for a postnatal contact without verifying identities or relationships. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maternalRecordId, infantRecordId, contactId } = request;
  const compute = (): Output => {
    H.domain(maternalRecordId.length > 0, "maternalRecordId");
    H.domain(infantRecordId.length > 0, "infantRecordId");
    H.domain(contactId.length > 0, "contactId");
    return {
      token: JSON.stringify([maternalRecordId, infantRecordId, contactId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { maternalRecordId: "M17", infantRecordId: "I17", contactId: "C3" },
  output: { token: '["M17","I17","C3"]' },
} satisfies ToolExample<Input, Output>;
export const postnatalMotherInfantPairKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/postnatal-mother-infant-pair-key",
    title: "Postnatal Mother Infant Pair Key",
    description:
      "Record an explicit maternal/infant pair for a postnatal contact without verifying identities or relationships.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maternalRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        infantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        contactId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["maternalRecordId", "infantRecordId", "contactId"],
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
          id: "maternalRecordId",
          label: "Maternal Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "infantRecordId",
          label: "Infant Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "contactId",
          label: "Contact Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = postnatalMotherInfantPairKeyTool.execute;
export default postnatalMotherInfantPairKeyTool;
