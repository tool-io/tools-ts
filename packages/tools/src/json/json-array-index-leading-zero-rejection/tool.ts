import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" } },
  required: ["valid"],
} as const;
/** Calculate json array index leading zero rejection from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    return { valid: /^(?:0|[1-9]\d*)(?![\s\S])/.test(token) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "01" },
  output: { valid: false },
} satisfies ToolExample<Input, Output>;
export const jsonArrayIndexLeadingZeroRejectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-array-index-leading-zero-rejection",
    title: "JSON Array Index Leading Zero Rejection Tool",
    description:
      "Calculate json array index leading zero rejection from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jsonArrayIndexLeadingZeroRejectionTool.execute;
export default jsonArrayIndexLeadingZeroRejectionTool;
