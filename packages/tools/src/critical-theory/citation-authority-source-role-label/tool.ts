import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citationId: string;
  readonly sourceRole: string;
  readonly assignedBy: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citationId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRole: { type: "string", maxLength: 8192, minLength: 1 },
    assignedBy: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["citationId", "sourceRole", "assignedBy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-assigned citation source role without endorsing a source’s authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citationId, sourceRole, assignedBy } = request;
  const compute = (): Output => {
    H.domain(
      citationId.length > 0 && sourceRole.length > 0 && assignedBy.length > 0,
      "citationId",
    );
    return {
      label:
        citationId +
        " [source role=" +
        sourceRole +
        "; assigned by " +
        assignedBy +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citationId: "C17", sourceRole: "background", assignedBy: "coder A" },
  output: { label: "C17 [source role=background; assigned by coder A]" },
} satisfies ToolExample<Input, Output>;
export const citationAuthoritySourceRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/citation-authority-source-role-label",
    title: "Citation Authority Source Role Label",
    description:
      "Label a caller-assigned citation source role without endorsing a source’s authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citationId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRole: { type: "string", maxLength: 8192, minLength: 1 },
        assignedBy: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["citationId", "sourceRole", "assignedBy"],
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
          id: "citationId",
          label: "Citation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRole",
          label: "Source Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedBy",
          label: "Assigned By",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = citationAuthoritySourceRoleLabelTool.execute;
export default citationAuthoritySourceRoleLabelTool;
