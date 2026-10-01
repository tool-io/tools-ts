import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly octet: number };
export type Output = { readonly keyPhase: number; readonly spin: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { keyPhase: { type: "integer" }, spin: { type: "boolean" } },
  required: ["keyPhase", "spin"],
} as const;
/** Compute quic short header keyphase bit from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    integer(octet, 0, 255);
    domain((octet & 192) === 64);
    return { keyPhase: (octet >> 2) & 1, spin: !!(octet & 32) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 100 },
  output: { keyPhase: 1, spin: true },
} satisfies ToolExample<Input, Output>;
export const quicShortHeaderKeyphaseBitTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/quic-short-header-keyphase-bit",
  title: "QUIC Short Header Keyphase Bit Tool",
  description:
    "Compute quic short header keyphase bit from explicit bounded inputs.",
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
      { id: "keyPhase", label: "Key Phase", valueType: { type: "integer" } },
      { id: "spin", label: "Spin", valueType: { type: "boolean" } },
    ],
  },
});
export const run = quicShortHeaderKeyphaseBitTool.execute;
export default quicShortHeaderKeyphaseBitTool;
