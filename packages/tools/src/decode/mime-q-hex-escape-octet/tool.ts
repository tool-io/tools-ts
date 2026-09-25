import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Calculate mime q hex escape octet from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    H.domain(/^=[0-9A-Fa-f]{2}(?![\s\S])/.test(token));
    return { octet: parseInt(token.slice(1), 16) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "=3D" },
  output: { octet: 61 },
} satisfies ToolExample<Input, Output>;
export const mimeQHexEscapeOctetTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "decode/mime-q-hex-escape-octet",
      title: "Mime Q Hex Escape Octet Tool",
      description:
        "Calculate mime q hex escape octet from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { octet: { type: "integer" } },
        required: ["octet"],
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
          { id: "octet", label: "Octet", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = mimeQHexEscapeOctetTool.execute;
export default mimeQHexEscapeOctetTool;
