import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly value: number;
  readonly exclusive: boolean;
  readonly lower: boolean;
};
export type Output = { readonly keyword: string; readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    exclusive: { type: "boolean" },
    lower: { type: "boolean" },
  },
  required: ["value", "exclusive", "lower"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keyword: { type: "string", maxLength: 8192 },
    value: { type: "number" },
  },
  required: ["keyword", "value"],
} as const;
/** Compute json schema exclusive bound token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, exclusive, lower } = input;
  const compute = (): Output => {
    return {
      keyword: lower
        ? exclusive
          ? "exclusiveMinimum"
          : "minimum"
        : exclusive
          ? "exclusiveMaximum"
          : "maximum",
      value,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 3, exclusive: true, lower: true },
  output: { keyword: "exclusiveMinimum", value: 3 },
} satisfies ToolExample<Input, Output>;
export const jsonSchemaExclusiveBoundTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-schema-exclusive-bound-token",
  title: "JSON Schema Exclusive Bound Token Tool",
  description:
    "Compute json schema exclusive bound token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "exclusive",
        label: "Exclusive",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "keyword", label: "Keyword", valueType: { type: "string" } },
      { id: "value", label: "Value", valueType: { type: "number" } },
    ],
  },
});
export const run = jsonSchemaExclusiveBoundTokenTool.execute;
export default jsonSchemaExclusiveBoundTokenTool;
