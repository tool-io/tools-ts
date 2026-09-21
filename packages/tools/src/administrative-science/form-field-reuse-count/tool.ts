import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstFields: readonly string[];
  readonly secondFields: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly reusedCount: number;
  readonly sharedFields: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    secondFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["firstFields", "secondFields", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusedCount: { type: "integer" },
    sharedFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["reusedCount", "sharedFields"],
} as const;
/** Count distinct supplied field-name reuse under an explicit case convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstFields, secondFields, caseSensitive } = request;
  const compute = (): Output => {
    const norm = (x: string) => (caseSensitive ? x : x.toLowerCase()),
      a = [...new Set(firstFields.map(norm))],
      b = new Set(secondFields.map(norm)),
      sharedFields = a.filter((x) => b.has(x));
    return { reusedCount: sharedFields.length, sharedFields };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstFields: ["Name", "Age", "Age"],
    secondFields: ["name", "City"],
    caseSensitive: false,
  },
  output: { reusedCount: 1, sharedFields: ["name"] },
} satisfies ToolExample<Input, Output>;
export const formFieldReuseCountTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "administrative-science/form-field-reuse-count",
      title: "Form Field Reuse Count Tool",
      description:
        "Count distinct supplied field-name reuse under an explicit case convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          secondFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          caseSensitive: { type: "boolean" },
        },
        required: ["firstFields", "secondFields", "caseSensitive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reusedCount: { type: "integer" },
          sharedFields: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["reusedCount", "sharedFields"],
      },
      ports: {
        inputs: [
          {
            id: "firstFields",
            label: "First Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "secondFields",
            label: "Second Fields",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "caseSensitive",
            label: "Case Sensitive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "reusedCount",
            label: "Reused Count",
            valueType: { type: "integer" },
          },
          {
            id: "sharedFields",
            label: "Shared Fields",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = formFieldReuseCountTool.execute;
export default formFieldReuseCountTool;
