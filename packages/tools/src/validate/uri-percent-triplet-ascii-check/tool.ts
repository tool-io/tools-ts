import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly valid: boolean;
  readonly octet: number;
  readonly ascii: boolean;
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
    valid: { type: "boolean" },
    octet: { type: "integer" },
    ascii: { type: "boolean" },
  },
  required: ["valid", "octet", "ascii"],
} as const;
/** Calculate uri percent triplet ascii check from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const valid = /^%[0-9A-Fa-f]{2}(?![\s\S])/.test(token),
      octet = valid ? parseInt(token.slice(1), 16) : 0;
    return { valid, octet, ascii: valid && octet <= 127 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "%41" },
  output: { valid: true, octet: 65, ascii: true },
} satisfies ToolExample<Input, Output>;
export const uriPercentTripletAsciiCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/uri-percent-triplet-ascii-check",
    title: "URI Percent Triplet Ascii Check Tool",
    description:
      "Calculate uri percent triplet ascii check from explicit caller-supplied inputs.",
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
        octet: { type: "integer" },
        ascii: { type: "boolean" },
      },
      required: ["valid", "octet", "ascii"],
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
        { id: "octet", label: "Octet", valueType: { type: "integer" } },
        { id: "ascii", label: "Ascii", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = uriPercentTripletAsciiCheckTool.execute;
export default uriPercentTripletAsciiCheckTool;
