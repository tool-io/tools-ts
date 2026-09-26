import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode one generic RFC 2047 Q encoded-text octet; context-specific phrase restrictions are outside this fragment. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    H.integer(octet, 0, 255);
    return {
      token:
        octet === 32
          ? "_"
          : octet >= 33 && octet <= 126 && ![61, 63, 95].includes(octet)
            ? String.fromCharCode(octet)
            : "=" + octet.toString(16).toUpperCase().padStart(2, "0"),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 61 },
  output: { token: "=3D" },
} satisfies ToolExample<Input, Output>;
export const mimeQLiteralEscapeChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/mime-q-literal-escape-choice",
    title: "Mime Q Literal Escape Choice Tool",
    description:
      "Encode one generic RFC 2047 Q encoded-text octet; context-specific phrase restrictions are outside this fragment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "octet",
          label: "Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = mimeQLiteralEscapeChoiceTool.execute;
export default mimeQLiteralEscapeChoiceTool;
