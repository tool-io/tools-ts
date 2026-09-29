import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly symbols: number;
  readonly entropyPerSymbol: number;
  readonly headerBits: number;
};
export type Output = {
  readonly payloadBits: number;
  readonly totalBits: number;
  readonly bitsPerSymbol: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbols: { type: "integer", minimum: 1 },
    entropyPerSymbol: { type: "number" },
    headerBits: { type: "integer", minimum: 0 },
  },
  required: ["symbols", "entropyPerSymbol", "headerBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payloadBits: { type: "number" },
    totalBits: { type: "number" },
    bitsPerSymbol: { type: "number" },
  },
  required: ["payloadBits", "totalBits", "bitsPerSymbol"],
} as const;
/** Compute entropy rate fixed block overhead from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { symbols, entropyPerSymbol, headerBits } = input;
  const compute = (): Output => {
    integer(symbols, 1);
    domain(entropyPerSymbol >= 0);
    integer(headerBits);
    const payloadBits = symbols * entropyPerSymbol,
      totalBits = payloadBits + headerBits;
    return { payloadBits, totalBits, bitsPerSymbol: totalBits / symbols };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { symbols: 8, entropyPerSymbol: 2, headerBits: 8 },
  output: { payloadBits: 16, totalBits: 24, bitsPerSymbol: 3 },
} satisfies ToolExample<Input, Output>;
export const entropyRateFixedBlockOverheadTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/entropy-rate-fixed-block-overhead",
  title: "Entropy Rate Fixed Block Overhead Tool",
  description:
    "Compute entropy rate fixed block overhead from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "symbols",
        label: "Symbols",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "entropyPerSymbol",
        label: "Entropy Per Symbol",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "headerBits",
        label: "Header Bits",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "payloadBits",
        label: "Payload Bits",
        valueType: { type: "number" },
      },
      { id: "totalBits", label: "Total Bits", valueType: { type: "number" } },
      {
        id: "bitsPerSymbol",
        label: "Bits Per Symbol",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = entropyRateFixedBlockOverheadTool.execute;
export default entropyRateFixedBlockOverheadTool;
