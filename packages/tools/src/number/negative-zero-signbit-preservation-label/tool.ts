import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number };
export type Output = { readonly label: string; readonly negativeZero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    negativeZero: { type: "boolean" },
  },
  required: ["label", "negativeZero"],
} as const;
/** Label the supplied binary64 negative zero sign as text before portable numeric output canonicalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value } = request;
  const compute = (): Output => {
    return {
      label: Object.is(value, -0) ? "-0" : String(value),
      negativeZero: Object.is(value, -0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: -2 },
  output: { label: "-2", negativeZero: false },
} satisfies ToolExample<Input, Output>;
export const negativeZeroSignbitPreservationLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["number", "mathematics"],
        keywords: ["number", "mathematics"],
      },
      id: "number/negative-zero-signbit-preservation-label",
      title: "Negative Zero Signbit Preservation Label",
      description:
        "Label the supplied binary64 negative zero sign as text before portable numeric output canonicalization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string", maxLength: 8192 },
          negativeZero: { type: "boolean" },
        },
        required: ["label", "negativeZero"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
          {
            id: "negativeZero",
            label: "Negative Zero",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = negativeZeroSignbitPreservationLabelTool.execute;
export default negativeZeroSignbitPreservationLabelTool;
