import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bban: string; readonly expectedWidth: number };
export type Output = { readonly valid: boolean; readonly leadingZeros: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bban: { type: "string", maxLength: 8192 },
    expectedWidth: { type: "integer", minimum: 1, maximum: 30 },
  },
  required: ["bban", "expectedWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, leadingZeros: { type: "integer" } },
  required: ["valid", "leadingZeros"],
} as const;
/** Calculate iban bban leading zero width check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bban, expectedWidth } = request;
  const compute = (): Output => {
    H.integer(expectedWidth, 1, 30);
    H.domain(/^[A-Z0-9]*(?![\s\S])/.test(bban));
    return {
      valid: bban.length === expectedWidth,
      leadingZeros: bban.length - bban.replace(/^0+/, "").length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bban: "001234", expectedWidth: 6 },
  output: { valid: true, leadingZeros: 2 },
} satisfies ToolExample<Input, Output>;
export const ibanBbanLeadingZeroWidthCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/iban-bban-leading-zero-width-check",
    title: "Iban BBAN Leading Zero Width Check Tool",
    description:
      "Calculate iban bban leading zero width check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bban: { type: "string", maxLength: 8192 },
        expectedWidth: { type: "integer", minimum: 1, maximum: 30 },
      },
      required: ["bban", "expectedWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        leadingZeros: { type: "integer" },
      },
      required: ["valid", "leadingZeros"],
    },
    ports: {
      inputs: [
        {
          id: "bban",
          label: "Bban",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedWidth",
          label: "Expected Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
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
export const run = ibanBbanLeadingZeroWidthCheckTool.execute;
export default ibanBbanLeadingZeroWidthCheckTool;
