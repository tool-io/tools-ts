import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  mod,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly left: number; readonly right: number };
export type Output = { readonly bytes: number; readonly wraps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "integer", minimum: 0, maximum: 4294967295 },
    right: { type: "integer", minimum: 0, maximum: 4294967295 },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bytes: { type: "number" }, wraps: { type: "boolean" } },
  required: ["bytes", "wraps"],
} as const;
/** Compute tcp sack block relative span from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    integer(left, 0, 4294967295);
    integer(right, 0, 4294967295);
    const bytes = mod(right - left, 4294967296);
    domain(bytes > 0 && bytes < 2147483648);
    return { bytes, wraps: right < left };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 4294967290, right: 4 },
  output: { bytes: 10, wraps: true },
} satisfies ToolExample<Input, Output>;
export const tcpSackBlockRelativeSpanTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/tcp-sack-block-relative-span",
  title: "TCP Sack Block Relative Span Tool",
  description:
    "Compute tcp sack block relative span from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "bytes", label: "Bytes", valueType: { type: "number" } },
      { id: "wraps", label: "Wraps", valueType: { type: "boolean" } },
    ],
  },
});
export const run = tcpSackBlockRelativeSpanTool.execute;
export default tcpSackBlockRelativeSpanTool;
