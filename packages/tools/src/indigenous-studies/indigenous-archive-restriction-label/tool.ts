import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly restriction: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192 },
    restriction: {
      type: "string",
      maxLength: 8192,
      enum: [
        "public",
        "permission-required",
        "restricted",
        "embargoed",
        "unknown",
      ],
    },
  },
  required: ["recordId", "restriction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Render explicitly supplied archive access metadata without disclosing restricted content or granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, restriction } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      [
        "public",
        "permission-required",
        "restricted",
        "embargoed",
        "unknown",
      ].includes(restriction),
      "restriction",
    );
    return { label: recordId + " [access: " + restriction + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", restriction: "permission-required" },
  output: { label: "R17 [access: permission-required]" },
} satisfies ToolExample<Input, Output>;
export const indigenousArchiveRestrictionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/indigenous-archive-restriction-label",
    title: "Indigenous Archive Restriction Label Tool",
    description:
      "Render explicitly supplied archive access metadata without disclosing restricted content or granting access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192 },
        restriction: {
          type: "string",
          maxLength: 8192,
          enum: [
            "public",
            "permission-required",
            "restricted",
            "embargoed",
            "unknown",
          ],
        },
      },
      required: ["recordId", "restriction"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "restriction",
          label: "Restriction",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = indigenousArchiveRestrictionLabelTool.execute;
export default indigenousArchiveRestrictionLabelTool;
