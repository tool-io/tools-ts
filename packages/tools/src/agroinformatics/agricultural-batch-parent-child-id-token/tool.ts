import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parent: string;
  readonly child: string;
  readonly source: string;
};
export type Output = { readonly key: string; readonly distinct: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parent: { type: "string", maxLength: 8192 },
    child: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["parent", "child", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    distinct: { type: "boolean" },
  },
  required: ["key", "distinct"],
} as const;
/** Preserve explicit agricultural parent/child/source references. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parent, child, source } = request;
  const compute = (): Output => {
    H.domain(parent.length > 0 && child.length > 0 && source.length > 0);
    return {
      key: JSON.stringify([source, parent, child]),
      distinct: parent !== child,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parent: "B1", child: "S1", source: "system-A" },
  output: { key: '["system-A","B1","S1"]', distinct: true },
} satisfies ToolExample<Input, Output>;
export const agriculturalBatchParentChildIdTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroinformatics/agricultural-batch-parent-child-id-token",
      title: "Agricultural Batch Parent Child ID Token Tool",
      description:
        "Preserve explicit agricultural parent/child/source references.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parent: { type: "string", maxLength: 8192 },
          child: { type: "string", maxLength: 8192 },
          source: { type: "string", maxLength: 8192 },
        },
        required: ["parent", "child", "source"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string", maxLength: 8192 },
          distinct: { type: "boolean" },
        },
        required: ["key", "distinct"],
      },
      ports: {
        inputs: [
          {
            id: "parent",
            label: "Parent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "child",
            label: "Child",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "key", label: "Key", valueType: { type: "string" } },
          { id: "distinct", label: "Distinct", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalBatchParentChildIdTokenTool.execute;
export default agriculturalBatchParentChildIdTokenTool;
