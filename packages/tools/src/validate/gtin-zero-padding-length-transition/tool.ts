import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string; readonly targetLength: number };
export type Output = { readonly digits: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    digits: { type: "string", maxLength: 8192 },
    targetLength: { type: "integer" },
  },
  required: ["digits", "targetLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
/** Pad a structurally sized GTIN without removing zeros or claiming that the checksum is valid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits, targetLength } = request;
  const compute = (): Output => {
    H.domain(/^\d+(?![\s\S])/.test(digits));
    H.domain(
      [8, 12, 13, 14].includes(digits.length) &&
        [8, 12, 13, 14].includes(targetLength) &&
        targetLength >= digits.length,
    );
    return { digits: digits.padStart(targetLength, "0") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "12345670", targetLength: 14 },
  output: { digits: "00000012345670" },
} satisfies ToolExample<Input, Output>;
export const gtinZeroPaddingLengthTransitionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/gtin-zero-padding-length-transition",
    title: "GTIN Zero Padding Length Transition Tool",
    description:
      "Pad a structurally sized GTIN without removing zeros or claiming that the checksum is valid.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        digits: { type: "string", maxLength: 8192 },
        targetLength: { type: "integer" },
      },
      required: ["digits", "targetLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digits: { type: "string", maxLength: 8192 } },
      required: ["digits"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetLength",
          label: "Target Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "digits", label: "Digits", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gtinZeroPaddingLengthTransitionTool.execute;
export default gtinZeroPaddingLengthTransitionTool;
