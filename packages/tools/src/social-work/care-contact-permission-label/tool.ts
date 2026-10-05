import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactCode: string;
  readonly permission: string;
};
export type Output = {
  readonly label: string;
  readonly contactPermittedByRecord: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactCode: { type: "string", maxLength: 8192 },
    permission: {
      type: "string",
      maxLength: 8192,
      enum: ["granted", "declined", "pending", "withdrawn"],
    },
  },
  required: ["contactCode", "permission"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    contactPermittedByRecord: { type: "boolean" },
  },
  required: ["label", "contactPermittedByRecord"],
} as const;
/** Render an explicitly recorded care-contact permission state; this does not independently authorize contact. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactCode, permission } = request;
  const compute = (): Output => {
    H.domain(contactCode.length > 0, "contactCode");
    H.domain(
      ["granted", "declined", "pending", "withdrawn"].includes(permission),
      "permission",
    );
    return {
      label: contactCode + " [contact permission: " + permission + "]",
      contactPermittedByRecord: permission === "granted",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactCode: "C17", permission: "granted" },
  output: {
    label: "C17 [contact permission: granted]",
    contactPermittedByRecord: true,
  },
} satisfies ToolExample<Input, Output>;
export const careContactPermissionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/care-contact-permission-label",
    title: "Care Contact Permission Label Tool",
    description:
      "Render an explicitly recorded care-contact permission state; this does not independently authorize contact.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactCode: { type: "string", maxLength: 8192 },
        permission: {
          type: "string",
          maxLength: 8192,
          enum: ["granted", "declined", "pending", "withdrawn"],
        },
      },
      required: ["contactCode", "permission"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        contactPermittedByRecord: { type: "boolean" },
      },
      required: ["label", "contactPermittedByRecord"],
    },
    ports: {
      inputs: [
        {
          id: "contactCode",
          label: "Contact Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permission",
          label: "Permission",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "contactPermittedByRecord",
          label: "Contact Permitted By Record",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = careContactPermissionLabelTool.execute;
export default careContactPermissionLabelTool;
