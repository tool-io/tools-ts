import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: string; readonly unit: string };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192 },
  },
  required: ["value", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Join an explicit value token and a single-line unit in square brackets. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, unit } = input;
  const compute = (): Output => {
    H.domain(unit.length > 0 && !/[\[\]\r\n]/.test(unit));
    return { text: value + " [" + unit + "]" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "12", unit: "m/s" },
  output: { text: "12 [m/s]" },
} satisfies ToolExample<Input, Output>;
export const measurementSquareBracketUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/measurement-square-bracket-unit-token",
    title: "Measurement Square Bracket Unit Token Tool",
    description:
      "Join an explicit value token and a single-line unit in square brackets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192 },
      },
      required: ["value", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = measurementSquareBracketUnitTokenTool.execute;
export default measurementSquareBracketUnitTokenTool;
