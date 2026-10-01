import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly payloadBytes: number;
  readonly vlanTags: number;
};
export type Output = {
  readonly paddingBytes: number;
  readonly frameBytes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payloadBytes: { type: "integer", minimum: 0, maximum: 1500 },
    vlanTags: { type: "integer", minimum: 0, maximum: 2 },
  },
  required: ["payloadBytes", "vlanTags"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paddingBytes: { type: "integer" },
    frameBytes: { type: "integer" },
  },
  required: ["paddingBytes", "frameBytes"],
} as const;
/** Compute ethernet padding payload shortfall from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { payloadBytes, vlanTags } = input;
  const compute = (): Output => {
    integer(payloadBytes, 0, 1500);
    integer(vlanTags, 0, 2);
    const header = 14 + 4 * vlanTags,
      paddingBytes = Math.max(0, 60 - header - payloadBytes);
    return {
      paddingBytes,
      frameBytes: header + payloadBytes + paddingBytes + 4,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { payloadBytes: 20, vlanTags: 0 },
  output: { paddingBytes: 26, frameBytes: 64 },
} satisfies ToolExample<Input, Output>;
export const ethernetPaddingPayloadShortfallTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ethernet-padding-payload-shortfall",
  title: "Ethernet Padding Payload Shortfall Tool",
  description:
    "Compute ethernet padding payload shortfall from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "payloadBytes",
        label: "Payload Bytes",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "vlanTags",
        label: "Vlan Tags",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "paddingBytes",
        label: "Padding Bytes",
        valueType: { type: "integer" },
      },
      {
        id: "frameBytes",
        label: "Frame Bytes",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = ethernetPaddingPayloadShortfallTool.execute;
export default ethernetPaddingPayloadShortfallTool;
