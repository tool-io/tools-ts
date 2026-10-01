import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly computedChecksum: number };
export type Output = { readonly transmittedChecksum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    computedChecksum: { type: "integer", minimum: 0, maximum: 65535 },
  },
  required: ["computedChecksum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transmittedChecksum: { type: "integer" } },
  required: ["transmittedChecksum"],
} as const;
/** Calculate udp checksum negative zero transmit word from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { computedChecksum } = request;
  const compute = (): Output => {
    H.integer(computedChecksum, 0, 65535);
    return {
      transmittedChecksum: computedChecksum === 0 ? 65535 : computedChecksum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { computedChecksum: 0 },
  output: { transmittedChecksum: 65535 },
} satisfies ToolExample<Input, Output>;
export const udpChecksumNegativeZeroTransmitWordTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "network/udp-checksum-negative-zero-transmit-word",
      title: "UDP Checksum Negative Zero Transmit Word Tool",
      description:
        "Calculate udp checksum negative zero transmit word from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          computedChecksum: { type: "integer", minimum: 0, maximum: 65535 },
        },
        required: ["computedChecksum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { transmittedChecksum: { type: "integer" } },
        required: ["transmittedChecksum"],
      },
      ports: {
        inputs: [
          {
            id: "computedChecksum",
            label: "Computed Checksum",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "transmittedChecksum",
            label: "Transmitted Checksum",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = udpChecksumNegativeZeroTransmitWordTool.execute;
export default udpChecksumNegativeZeroTransmitWordTool;
