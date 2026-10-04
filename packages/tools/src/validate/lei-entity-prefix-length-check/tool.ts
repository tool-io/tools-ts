import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly validLength: boolean;
  readonly validAlphabet: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validLength: { type: "boolean" },
    validAlphabet: { type: "boolean" },
  },
  required: ["validLength", "validAlphabet"],
} as const;
/** Check only overall LEI width and uppercase alphanumeric alphabet; LOU structure and checksum are separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    return {
      validLength: token.length === 20,
      validAlphabet: /^[A-Z0-9]+(?![\s\S])/.test(token),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "5493001KJTIIGC8Y1R12" },
  output: { validLength: true, validAlphabet: true },
} satisfies ToolExample<Input, Output>;
export const leiEntityPrefixLengthCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/lei-entity-prefix-length-check",
    title: "LEI Entity Prefix Length Check Tool",
    description:
      "Check only overall LEI width and uppercase alphanumeric alphabet; LOU structure and checksum are separate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validLength: { type: "boolean" },
        validAlphabet: { type: "boolean" },
      },
      required: ["validLength", "validAlphabet"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "validLength",
          label: "Valid Length",
          valueType: { type: "boolean" },
        },
        {
          id: "validAlphabet",
          label: "Valid Alphabet",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = leiEntityPrefixLengthCheckTool.execute;
export default leiEntityPrefixLengthCheckTool;
