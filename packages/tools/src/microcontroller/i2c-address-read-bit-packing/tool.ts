import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly address: number; readonly read: boolean };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "integer", minimum: 0, maximum: 127 },
    read: { type: "boolean" },
  },
  required: ["address", "read"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Calculate i²c address read bit packing from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { address, read } = input;
  const compute = (): Output => {
    H.integer(address, 0, 127);
    return { octet: address * 2 + (read ? 1 : 0) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { address: 80, read: true },
  output: { octet: 161 },
} satisfies ToolExample<Input, Output>;
export const i2cAddressReadBitPackingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/i2c-address-read-bit-packing",
    title: "I²C Address Read Bit Packing Tool",
    description:
      "Calculate i²c address read bit packing from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        address: { type: "integer", minimum: 0, maximum: 127 },
        read: { type: "boolean" },
      },
      required: ["address", "read"],
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
          id: "address",
          label: "Address",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "read",
          label: "Read",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "octet", label: "Octet", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = i2cAddressReadBitPackingTool.execute;
export default i2cAddressReadBitPackingTool;
