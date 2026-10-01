import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hardwareLength: number;
  readonly protocolLength: number;
};
export type Output = {
  readonly addressBytes: number;
  readonly packetBytes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hardwareLength: { type: "integer", minimum: 0, maximum: 255 },
    protocolLength: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["hardwareLength", "protocolLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    addressBytes: { type: "integer" },
    packetBytes: { type: "integer" },
  },
  required: ["addressBytes", "packetBytes"],
} as const;
/** Calculate arp hardware protocol address span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hardwareLength, protocolLength } = request;
  const compute = (): Output => {
    H.integer(hardwareLength, 0, 255);
    H.integer(protocolLength, 0, 255);
    const addressBytes = 2 * (hardwareLength + protocolLength);
    return { addressBytes, packetBytes: 8 + addressBytes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hardwareLength: 6, protocolLength: 4 },
  output: { addressBytes: 20, packetBytes: 28 },
} satisfies ToolExample<Input, Output>;
export const arpHardwareProtocolAddressSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/arp-hardware-protocol-address-span",
    title: "Arp Hardware Protocol Address Span Tool",
    description:
      "Calculate arp hardware protocol address span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hardwareLength: { type: "integer", minimum: 0, maximum: 255 },
        protocolLength: { type: "integer", minimum: 0, maximum: 255 },
      },
      required: ["hardwareLength", "protocolLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        addressBytes: { type: "integer" },
        packetBytes: { type: "integer" },
      },
      required: ["addressBytes", "packetBytes"],
    },
    ports: {
      inputs: [
        {
          id: "hardwareLength",
          label: "Hardware Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "protocolLength",
          label: "Protocol Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "addressBytes",
          label: "Address Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "packetBytes",
          label: "Packet Bytes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = arpHardwareProtocolAddressSpanTool.execute;
export default arpHardwareProtocolAddressSpanTool;
