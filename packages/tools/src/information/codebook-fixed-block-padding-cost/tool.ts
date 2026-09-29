import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbols: number;
  readonly blockSize: number;
  readonly bitsPerSymbol: number;
};
export type Output = {
  readonly paddingSymbols: number;
  readonly paddingBits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbols: { type: "integer", minimum: 0 },
    blockSize: { type: "integer", minimum: 1 },
    bitsPerSymbol: { type: "number", minimum: 0 },
  },
  required: ["symbols", "blockSize", "bitsPerSymbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paddingSymbols: { type: "integer" },
    paddingBits: { type: "number" },
  },
  required: ["paddingSymbols", "paddingBits"],
} as const;
/** Calculate codebook fixed block padding cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbols, blockSize, bitsPerSymbol } = request;
  const compute = (): Output => {
    H.integer(symbols, 0);
    H.integer(blockSize, 1);
    H.domain(bitsPerSymbol >= 0);
    const paddingSymbols = H.mod(-symbols, blockSize);
    return { paddingSymbols, paddingBits: paddingSymbols * bitsPerSymbol };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbols: 10, blockSize: 4, bitsPerSymbol: 3 },
  output: { paddingSymbols: 2, paddingBits: 6 },
} satisfies ToolExample<Input, Output>;
export const codebookFixedBlockPaddingCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/codebook-fixed-block-padding-cost",
    title: "Codebook Fixed Block Padding Cost Tool",
    description:
      "Calculate codebook fixed block padding cost from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbols: { type: "integer", minimum: 0 },
        blockSize: { type: "integer", minimum: 1 },
        bitsPerSymbol: { type: "number", minimum: 0 },
      },
      required: ["symbols", "blockSize", "bitsPerSymbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paddingSymbols: { type: "integer" },
        paddingBits: { type: "number" },
      },
      required: ["paddingSymbols", "paddingBits"],
    },
    ports: {
      inputs: [
        {
          id: "symbols",
          label: "Symbols",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockSize",
          label: "Block Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bitsPerSymbol",
          label: "Bits Per Symbol",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "paddingSymbols",
          label: "Padding Symbols",
          valueType: { type: "integer" },
        },
        {
          id: "paddingBits",
          label: "Padding Bits",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = codebookFixedBlockPaddingCostTool.execute;
export default codebookFixedBlockPaddingCostTool;
