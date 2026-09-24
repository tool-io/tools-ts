import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbols: readonly string[];
  readonly suppliedFootSymbols: readonly string[];
};
export type Output = {
  readonly recognizedSymbols: number;
  readonly unknownSymbols: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbols: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedFootSymbols: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["symbols", "suppliedFootSymbols"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognizedSymbols: { type: "integer" },
    unknownSymbols: { type: "integer" },
  },
  required: ["recognizedSymbols", "unknownSymbols"],
} as const;
/** Count caller-tokenized metrical symbols without scanning a poem or inferring a meter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbols, suppliedFootSymbols } = request;
  const compute = (): Output => {
    return {
      recognizedSymbols: symbols.filter((x) => suppliedFootSymbols.includes(x))
        .length,
      unknownSymbols: symbols.filter((x) => !suppliedFootSymbols.includes(x))
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbols: ["u", "-", "?"], suppliedFootSymbols: ["u", "-"] },
  output: { recognizedSymbols: 2, unknownSymbols: 1 },
} satisfies ToolExample<Input, Output>;
export const metricalFootSymbolCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/metrical-foot-symbol-count",
    title: "Metrical Foot Symbol Count Tool",
    description:
      "Count caller-tokenized metrical symbols without scanning a poem or inferring a meter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbols: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedFootSymbols: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["symbols", "suppliedFootSymbols"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognizedSymbols: { type: "integer" },
        unknownSymbols: { type: "integer" },
      },
      required: ["recognizedSymbols", "unknownSymbols"],
    },
    ports: {
      inputs: [
        {
          id: "symbols",
          label: "Symbols",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedFootSymbols",
          label: "Supplied Foot Symbols",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recognizedSymbols",
          label: "Recognized Symbols",
          valueType: { type: "integer" },
        },
        {
          id: "unknownSymbols",
          label: "Unknown Symbols",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = metricalFootSymbolCountTool.execute;
export default metricalFootSymbolCountTool;
