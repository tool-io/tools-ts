import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly valid: boolean; readonly leadingZero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, leadingZero: { type: "boolean" } },
  required: ["valid", "leadingZero"],
} as const;
/** Calculate isrc recording number fixed width check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    return {
      valid: /^\d{5}(?![\s\S])/.test(token),
      leadingZero: token.startsWith("0"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "00123" },
  output: { valid: true, leadingZero: true },
} satisfies ToolExample<Input, Output>;
export const isrcRecordingNumberFixedWidthCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/isrc-recording-number-fixed-width-check",
    title: "Isrc Recording Number Fixed Width Check Tool",
    description:
      "Calculate isrc recording number fixed width check from explicit caller-supplied inputs.",
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
        valid: { type: "boolean" },
        leadingZero: { type: "boolean" },
      },
      required: ["valid", "leadingZero"],
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
        {
          id: "leadingZero",
          label: "Leading Zero",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = isrcRecordingNumberFixedWidthCheckTool.execute;
export default isrcRecordingNumberFixedWidthCheckTool;
