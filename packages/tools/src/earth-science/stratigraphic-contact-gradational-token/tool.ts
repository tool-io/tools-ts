import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactId: string;
  readonly contactType: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactId: { type: "string", maxLength: 8192, minLength: 1 },
    contactType: {
      type: "string",
      maxLength: 8192,
      enum: ["sharp", "gradational", "uncertain", "not-observed"],
    },
  },
  required: ["contactId", "contactType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded stratigraphic contact character without identifying contacts from data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactId, contactType } = request;
  const compute = (): Output => {
    H.domain(contactId.length > 0, "contactId");
    H.domain(
      ["sharp", "gradational", "uncertain", "not-observed"].includes(
        contactType,
      ),
      "contactType",
    );
    return { label: contactId + " [" + contactType + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactId: "C17", contactType: "gradational" },
  output: { label: "C17 [gradational]" },
} satisfies ToolExample<Input, Output>;
export const stratigraphicContactGradationalTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/stratigraphic-contact-gradational-token",
      title: "Stratigraphic Contact Gradational Token Tool",
      description:
        "Label an explicitly recorded stratigraphic contact character without identifying contacts from data.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactId: { type: "string", maxLength: 8192, minLength: 1 },
          contactType: {
            type: "string",
            maxLength: 8192,
            enum: ["sharp", "gradational", "uncertain", "not-observed"],
          },
        },
        required: ["contactId", "contactType"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
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
            id: "contactType",
            label: "Contact Type",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = stratigraphicContactGradationalTokenTool.execute;
export default stratigraphicContactGradationalTokenTool;
