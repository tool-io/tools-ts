import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactId: string;
  readonly recordedProviderId: string;
  readonly continuityGroup: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedProviderId: { type: "string", maxLength: 8192, minLength: 1 },
    continuityGroup: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["contactId", "recordedProviderId", "continuityGroup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit provider and continuity-group identifiers for a contact without assessing care continuity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactId, recordedProviderId, continuityGroup } = request;
  const compute = (): Output => {
    H.domain(contactId.length > 0, "contactId");
    H.domain(recordedProviderId.length > 0, "recordedProviderId");
    H.domain(continuityGroup.length > 0, "continuityGroup");
    return {
      token: JSON.stringify([contactId, recordedProviderId, continuityGroup]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactId: "C17",
    recordedProviderId: "PROV3",
    continuityGroup: "GROUP-A",
  },
  output: { token: '["C17","PROV3","GROUP-A"]' },
} satisfies ToolExample<Input, Output>;
export const midwiferyContinuityContactLabelTool = H.defineSchemaCalculation<
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
    id: "midwifery/midwifery-continuity-contact-label",
    title: "Midwifery Continuity Contact Label",
    description:
      "Record explicit provider and continuity-group identifiers for a contact without assessing care continuity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedProviderId: { type: "string", maxLength: 8192, minLength: 1 },
        continuityGroup: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["contactId", "recordedProviderId", "continuityGroup"],
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
          id: "contactId",
          label: "Contact Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedProviderId",
          label: "Recorded Provider Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "continuityGroup",
          label: "Continuity Group",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = midwiferyContinuityContactLabelTool.execute;
export default midwiferyContinuityContactLabelTool;
