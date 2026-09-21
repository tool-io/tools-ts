import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fieldIds: readonly string[] };
export type Output = {
  readonly repeatedOccurrences: number;
  readonly distinctFields: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["fieldIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repeatedOccurrences: { type: "integer" },
    distinctFields: { type: "integer" },
  },
  required: ["repeatedOccurrences", "distinctFields"],
} as const;
/** Calculate form repeated field count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldIds } = request;
  const compute = (): Output => {
    return {
      repeatedOccurrences: fieldIds.length - new Set(fieldIds).size,
      distinctFields: new Set(fieldIds).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldIds: ["a", "b", "a", "a"] },
  output: { repeatedOccurrences: 2, distinctFields: 2 },
} satisfies ToolExample<Input, Output>;
export const formRepeatedFieldCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/form-repeated-field-count",
    title: "Form Repeated Field Count Tool",
    description:
      "Calculate form repeated field count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["fieldIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repeatedOccurrences: { type: "integer" },
        distinctFields: { type: "integer" },
      },
      required: ["repeatedOccurrences", "distinctFields"],
    },
    ports: {
      inputs: [
        {
          id: "fieldIds",
          label: "Field Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "repeatedOccurrences",
          label: "Repeated Occurrences",
          valueType: { type: "integer" },
        },
        {
          id: "distinctFields",
          label: "Distinct Fields",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = formRepeatedFieldCountTool.execute;
export default formRepeatedFieldCountTool;
