import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly field: string; readonly width: number };
export type Output = {
  readonly valid: boolean;
  readonly preserved: string;
  readonly leadingZeros: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    field: { type: "string", maxLength: 8192 },
    width: { type: "integer", minimum: 1, maximum: 128 },
  },
  required: ["field", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    preserved: { type: "string", maxLength: 8192 },
    leadingZeros: { type: "integer" },
  },
  required: ["valid", "preserved", "leadingZeros"],
} as const;
/** Calculate gs1 ai fixed field leading zero preserver from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { field, width } = request;
  const compute = (): Output => {
    H.integer(width, 1, 128);
    return {
      valid: field.length === width && /^[0-9]+(?![\s\S])/.test(field),
      preserved: field,
      leadingZeros: field.length - field.replace(/^0+/, "").length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { field: "000123", width: 6 },
  output: { valid: true, preserved: "000123", leadingZeros: 3 },
} satisfies ToolExample<Input, Output>;
export const gs1AiFixedFieldLeadingZeroPreserverTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "validate/gs1-ai-fixed-field-leading-zero-preserver",
      title: "GS1 AI Fixed Field Leading Zero Preserver Tool",
      description:
        "Calculate gs1 ai fixed field leading zero preserver from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          field: { type: "string", maxLength: 8192 },
          width: { type: "integer", minimum: 1, maximum: 128 },
        },
        required: ["field", "width"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valid: { type: "boolean" },
          preserved: { type: "string", maxLength: 8192 },
          leadingZeros: { type: "integer" },
        },
        required: ["valid", "preserved", "leadingZeros"],
      },
      ports: {
        inputs: [
          {
            id: "field",
            label: "Field",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "width",
            label: "Width",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
          {
            id: "preserved",
            label: "Preserved",
            valueType: { type: "string" },
          },
          {
            id: "leadingZeros",
            label: "Leading Zeros",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gs1AiFixedFieldLeadingZeroPreserverTool.execute;
export default gs1AiFixedFieldLeadingZeroPreserverTool;
