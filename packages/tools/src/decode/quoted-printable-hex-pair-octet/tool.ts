import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
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
/** Compute quoted printable hex pair octet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    domain(/^=[0-9A-Fa-f]{2}(?![\s\S])/.test(token));
    return { octet: parseInt(token.slice(1), 16) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "=3D" },
  output: { octet: 61 },
} satisfies ToolExample<Input, Output>;
export const quotedPrintableHexPairOctetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/quoted-printable-hex-pair-octet",
  title: "Quoted Printable Hex Pair Octet Tool",
  description:
    "Compute quoted printable hex pair octet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "octet", label: "Octet", valueType: { type: "integer" } }],
  },
});
export const run = quotedPrintableHexPairOctetTool.execute;
export default quotedPrintableHexPairOctetTool;
