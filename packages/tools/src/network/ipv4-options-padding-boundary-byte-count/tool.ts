import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly optionBytes: number };
export type Output = { readonly paddingBytes: number; readonly ihl: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { optionBytes: { type: "integer", minimum: 0, maximum: 40 } },
  required: ["optionBytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { paddingBytes: { type: "integer" }, ihl: { type: "integer" } },
  required: ["paddingBytes", "ihl"],
} as const;
/** Compute ipv4 options padding boundary byte count from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { optionBytes } = input;
  const compute = (): Output => {
    integer(optionBytes, 0, 40);
    const paddingBytes = (4 - (optionBytes % 4)) % 4;
    return { paddingBytes, ihl: 5 + (optionBytes + paddingBytes) / 4 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { optionBytes: 5 },
  output: { paddingBytes: 3, ihl: 7 },
} satisfies ToolExample<Input, Output>;
export const ipv4OptionsPaddingBoundaryByteCountTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/ipv4-options-padding-boundary-byte-count",
  title: "IPv4 Options Padding Boundary Byte Count Tool",
  description:
    "Compute ipv4 options padding boundary byte count from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "optionBytes",
        label: "Option Bytes",
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
      { id: "ihl", label: "Ihl", valueType: { type: "integer" } },
    ],
  },
});
export const run = ipv4OptionsPaddingBoundaryByteCountTool.execute;
export default ipv4OptionsPaddingBoundaryByteCountTool;
