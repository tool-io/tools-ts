import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sourceId: string; readonly condition: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    condition: {
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
  required: ["sourceId", "condition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Render an explicitly recorded regional-source access condition without granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, condition } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(
      [
        "public",
        "permission-required",
        "restricted",
        "embargoed",
        "unknown",
      ].includes(condition),
      "condition",
    );
    return { tag: sourceId + " [access: " + condition + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceId: "S17", condition: "permission-required" },
  output: { tag: "S17 [access: permission-required]" },
} satisfies ToolExample<Input, Output>;
export const regionalSourceAccessConditionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/regional-source-access-condition-tag",
    title: "Regional Source Access Condition Tag",
    description:
      "Render an explicitly recorded regional-source access condition without granting access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        condition: {
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
      required: ["sourceId", "condition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "condition",
          label: "Condition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = regionalSourceAccessConditionTagTool.execute;
export default regionalSourceAccessConditionTagTool;
