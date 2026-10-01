import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly code: number; readonly length: number };
export type Output = { readonly header: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "integer", minimum: 1, maximum: 254 },
    length: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["code", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    header: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["header"],
} as const;
/** Compute dhcp option length octet field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { code, length } = input;
  const compute = (): Output => {
    integer(code, 1, 254);
    integer(length, 0, 255);
    return { header: [code, length] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { code: 53, length: 1 },
  output: { header: [53, 1] },
} satisfies ToolExample<Input, Output>;
export const dhcpOptionLengthOctetFieldTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/dhcp-option-length-octet-field",
  title: "DHCP Option Length Octet Field Tool",
  description:
    "Compute dhcp option length octet field from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "length",
        label: "Length",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "header",
        label: "Header",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = dhcpOptionLengthOctetFieldTool.execute;
export default dhcpOptionLengthOctetFieldTool;
