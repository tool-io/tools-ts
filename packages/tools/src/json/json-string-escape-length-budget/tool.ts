import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string };
export type Output = {
  readonly sourceCodeUnits: number;
  readonly escapedCodeUnits: number;
  readonly overhead: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCodeUnits: { type: "integer" },
    escapedCodeUnits: { type: "integer" },
    overhead: { type: "integer" },
  },
  required: ["sourceCodeUnits", "escapedCodeUnits", "overhead"],
} as const;
/** Calculate json string escape length budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    const escapedCodeUnits = JSON.stringify(value).length;
    return {
      sourceCodeUnits: value.length,
      escapedCodeUnits,
      overhead: escapedCodeUnits - value.length,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "a\nb" },
  output: { sourceCodeUnits: 3, escapedCodeUnits: 6, overhead: 3 },
} satisfies ToolExample<Input, Output>;
export const jsonStringEscapeLengthBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-string-escape-length-budget",
    title: "JSON String Escape Length Budget Tool",
    description:
      "Calculate json string escape length budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "string", maxLength: 8192 } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCodeUnits: { type: "integer" },
        escapedCodeUnits: { type: "integer" },
        overhead: { type: "integer" },
      },
      required: ["sourceCodeUnits", "escapedCodeUnits", "overhead"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sourceCodeUnits",
          label: "Source Code Units",
          valueType: { type: "integer" },
        },
        {
          id: "escapedCodeUnits",
          label: "Escaped Code Units",
          valueType: { type: "integer" },
        },
        { id: "overhead", label: "Overhead", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = jsonStringEscapeLengthBudgetTool.execute;
export default jsonStringEscapeLengthBudgetTool;
