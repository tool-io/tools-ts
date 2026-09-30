import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly minimum: number;
  readonly exclusive: boolean;
};
export type Output = { readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    minimum: { type: "number" },
    exclusive: { type: "boolean" },
  },
  required: ["value", "minimum", "exclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" } },
  required: ["valid"],
} as const;
/** Calculate json schema minimum exclusive bound pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, minimum, exclusive } = input;
  const compute = (): Output => {
    return { valid: exclusive ? value > minimum : value >= minimum };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 2, minimum: 2, exclusive: true },
  output: { valid: false },
} satisfies ToolExample<Input, Output>;
export const jsonSchemaMinimumExclusiveBoundPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "json/json-schema-minimum-exclusive-bound-pair",
      title: "JSON Schema Minimum Exclusive Bound Pair Tool",
      description:
        "Calculate json schema minimum exclusive bound pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          minimum: { type: "number" },
          exclusive: { type: "boolean" },
        },
        required: ["value", "minimum", "exclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { valid: { type: "boolean" } },
        required: ["valid"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimum",
            label: "Minimum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exclusive",
            label: "Exclusive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = jsonSchemaMinimumExclusiveBoundPairTool.execute;
export default jsonSchemaMinimumExclusiveBoundPairTool;
