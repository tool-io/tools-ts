import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly byte: number };
export type Output = { readonly unreserved: boolean; readonly literal: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { byte: { type: "integer", minimum: 0, maximum: 127 } },
  required: ["byte"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unreserved: { type: "boolean" },
    literal: { type: "string", maxLength: 8192 },
  },
  required: ["unreserved", "literal"],
} as const;
/** Classify one ASCII byte under the RFC 3986 unreserved set. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { byte } = request;
  const compute = (): Output => {
    H.integer(byte, 0, 127);
    return {
      unreserved:
        (byte >= 65 && byte <= 90) ||
        (byte >= 97 && byte <= 122) ||
        (byte >= 48 && byte <= 57) ||
        [45, 46, 95, 126].includes(byte),
      literal: String.fromCharCode(byte),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { byte: 65 },
  output: { unreserved: true, literal: "A" },
} satisfies ToolExample<Input, Output>;
export const percentEncodingUnreservedFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/percent-encoding-unreserved-flag",
    title: "Percent Encoding Unreserved Flag Tool",
    description: "Classify one ASCII byte under the RFC 3986 unreserved set.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { byte: { type: "integer", minimum: 0, maximum: 127 } },
      required: ["byte"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unreserved: { type: "boolean" },
        literal: { type: "string", maxLength: 8192 },
      },
      required: ["unreserved", "literal"],
    },
    ports: {
      inputs: [
        {
          id: "byte",
          label: "Byte",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unreserved",
          label: "Unreserved",
          valueType: { type: "boolean" },
        },
        { id: "literal", label: "Literal", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = percentEncodingUnreservedFlagTool.execute;
export default percentEncodingUnreservedFlagTool;
