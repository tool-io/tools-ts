import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceId: string;
  readonly accessStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
    accessStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["public", "permission-required", "restricted", "unknown"],
    },
  },
  required: ["evidenceId", "accessStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied evidence-access status without granting access or establishing rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceId, accessStatus } = request;
  const compute = (): Output => {
    H.domain(evidenceId.length > 0, "evidenceId");
    H.domain(
      ["public", "permission-required", "restricted", "unknown"].includes(
        accessStatus,
      ),
      "accessStatus",
    );
    return { label: evidenceId + " [" + accessStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceId: "E17", accessStatus: "restricted" },
  output: { label: "E17 [restricted]" },
} satisfies ToolExample<Input, Output>;
export const evidenceAccessPermissionStatusTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/evidence-access-permission-status-tag",
    title: "Evidence Access Permission Status Tag Tool",
    description:
      "Label an explicitly supplied evidence-access status without granting access or establishing rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
        accessStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["public", "permission-required", "restricted", "unknown"],
        },
      },
      required: ["evidenceId", "accessStatus"],
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
          id: "evidenceId",
          label: "Evidence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accessStatus",
          label: "Access Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = evidenceAccessPermissionStatusTagTool.execute;
export default evidenceAccessPermissionStatusTagTool;
