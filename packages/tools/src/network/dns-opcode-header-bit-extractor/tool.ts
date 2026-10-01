import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly headerWord: number };
export type Output = { readonly opcode: number; readonly response: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { headerWord: { type: "integer", minimum: 0, maximum: 65535 } },
  required: ["headerWord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { opcode: { type: "integer" }, response: { type: "boolean" } },
  required: ["opcode", "response"],
} as const;
/** Compute dns opcode header bit extractor from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { headerWord } = input;
  const compute = (): Output => {
    integer(headerWord, 0, 65535);
    return {
      opcode: (headerWord >> 11) & 15,
      response: !!(headerWord & 32768),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { headerWord: 36864 },
  output: { opcode: 2, response: true },
} satisfies ToolExample<Input, Output>;
export const dnsOpcodeHeaderBitExtractorTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/dns-opcode-header-bit-extractor",
  title: "DNS Opcode Header Bit Extractor Tool",
  description:
    "Compute dns opcode header bit extractor from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "headerWord",
        label: "Header Word",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "opcode", label: "Opcode", valueType: { type: "integer" } },
      { id: "response", label: "Response", valueType: { type: "boolean" } },
    ],
  },
});
export const run = dnsOpcodeHeaderBitExtractorTool.execute;
export default dnsOpcodeHeaderBitExtractorTool;
