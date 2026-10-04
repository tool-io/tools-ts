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
/** Check CAS registry token shape and the leading-group zero rule; checksum validation is separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const r = /^(\d{2,7})-\d{2}-\d(?![\s\S])/.exec(token);
    const leadingZero = r !== null && r[1].startsWith("0");
    return { valid: r !== null && !leadingZero, leadingZero };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "64-17-5" },
  output: { valid: true, leadingZero: false },
} satisfies ToolExample<Input, Output>;
export const casRegistryLeadinggroupZeroGuardTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/cas-registry-leadinggroup-zero-guard",
    title: "CAS Registry Leadinggroup Zero Guard Tool",
    description:
      "Check CAS registry token shape and the leading-group zero rule; checksum validation is separate.",
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
export const run = casRegistryLeadinggroupZeroGuardTool.execute;
export default casRegistryLeadinggroupZeroGuardTool;
