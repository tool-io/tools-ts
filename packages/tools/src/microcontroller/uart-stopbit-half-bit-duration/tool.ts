import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly halfBits: number; readonly bitRate: number };
export type Output = { readonly seconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    halfBits: { type: "integer" },
    bitRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["halfBits", "bitRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { seconds: { type: "number" } },
  required: ["seconds"],
} as const;
/** Compute uart stopbit half bit duration from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { halfBits, bitRate } = input;
  const compute = (): Output => {
    domain([1, 2, 3, 4].includes(halfBits));
    positive(bitRate);
    return { seconds: halfBits / (2 * bitRate) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { halfBits: 3, bitRate: 1000 },
  output: { seconds: 0.0015 },
} satisfies ToolExample<Input, Output>;
export const uartStopbitHalfBitDurationTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/uart-stopbit-half-bit-duration",
  title: "Uart Stopbit Half Bit Duration Tool",
  description:
    "Compute uart stopbit half bit duration from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "halfBits",
        label: "Half Bits",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "bitRate",
        label: "Bit Rate",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "seconds", label: "Seconds", valueType: { type: "number" } },
    ],
  },
});
export const run = uartStopbitHalfBitDurationTool.execute;
export default uartStopbitHalfBitDurationTool;
