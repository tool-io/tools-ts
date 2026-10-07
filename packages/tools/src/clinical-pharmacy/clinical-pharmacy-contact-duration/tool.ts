import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactStartMinutes: number;
  readonly contactEndMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactStartMinutes: { type: "number" },
    contactEndMinutes: { type: "number" },
  },
  required: ["contactStartMinutes", "contactEndMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit pharmacy contact markers in minutes without assigning billing or care requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactStartMinutes, contactEndMinutes } = request;
  const compute = (): Output => {
    return { signedGap: contactEndMinutes - contactStartMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactStartMinutes: 12, contactEndMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const clinicalPharmacyContactDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/clinical-pharmacy-contact-duration",
    title: "Clinical Pharmacy Contact Duration",
    description:
      "Subtract explicit pharmacy contact markers in minutes without assigning billing or care requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactStartMinutes: { type: "number" },
        contactEndMinutes: { type: "number" },
      },
      required: ["contactStartMinutes", "contactEndMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "contactStartMinutes",
          label: "Contact Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactEndMinutes",
          label: "Contact End Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = clinicalPharmacyContactDurationTool.execute;
export default clinicalPharmacyContactDurationTool;
