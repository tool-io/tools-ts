import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly octet: number };
export type Output = { readonly payload: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 127 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { payload: { type: "integer" } },
  required: ["payload"],
} as const;
/** Compute varint terminal byte payload from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    integer(octet, 0, 127);
    return { payload: octet };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 42 },
  output: { payload: 42 },
} satisfies ToolExample<Input, Output>;
export const varintTerminalBytePayloadTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "decode/varint-terminal-byte-payload",
  title: "Varint Terminal Byte Payload Tool",
  description:
    "Compute varint terminal byte payload from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "octet",
        label: "Octet",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "payload", label: "Payload", valueType: { type: "integer" } },
    ],
  },
});
export const run = varintTerminalBytePayloadTool.execute;
export default varintTerminalBytePayloadTool;
