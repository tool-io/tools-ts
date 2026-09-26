import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly payload: number };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { payload: { type: "integer", minimum: 0, maximum: 127 } },
  required: ["payload"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Compute varint terminal byte from payload from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { payload } = input;
  const compute = (): Output => {
    integer(payload, 0, 127);
    return { octet: payload };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { payload: 42 },
  output: { octet: 42 },
} satisfies ToolExample<Input, Output>;
export const varintTerminalByteFromPayloadTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "encode/varint-terminal-byte-from-payload",
  title: "Varint Terminal Byte From Payload Tool",
  description:
    "Compute varint terminal byte from payload from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "payload",
        label: "Payload",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "octet", label: "Octet", valueType: { type: "integer" } }],
  },
});
export const run = varintTerminalByteFromPayloadTool.execute;
export default varintTerminalByteFromPayloadTool;
