import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly symbol: string;
  readonly suppliedSymbols: readonly string[];
  readonly suppliedNamespace: string;
};
export type Output = {
  readonly namespace: string;
  readonly recognized: boolean;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symbol: { type: "string", maxLength: 8192 },
    suppliedSymbols: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedNamespace: { type: "string", maxLength: 8192 },
  },
  required: ["symbol", "suppliedSymbols", "suppliedNamespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192 },
    recognized: { type: "boolean" },
    index: { type: "integer" },
  },
  required: ["namespace", "recognized", "index"],
} as const;
/** Inspect a symbol within caller-supplied historical-unit vocabulary without inventing conversion factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbol, suppliedSymbols, suppliedNamespace } = request;
  const compute = (): Output => {
    H.domain(
      suppliedNamespace.length > 0 &&
        new Set(suppliedSymbols).size === suppliedSymbols.length,
    );
    return {
      namespace: suppliedNamespace,
      recognized: suppliedSymbols.includes(symbol),
      index: suppliedSymbols.indexOf(symbol),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    symbol: "ell",
    suppliedSymbols: ["ell", "yard"],
    suppliedNamespace: "archive-A",
  },
  output: { namespace: "archive-A", recognized: true, index: 0 },
} satisfies ToolExample<Input, Output>;
export const historicalUnitSymbolTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-unit-symbol-token",
    title: "Historical Unit Symbol Token Tool",
    description:
      "Inspect a symbol within caller-supplied historical-unit vocabulary without inventing conversion factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symbol: { type: "string", maxLength: 8192 },
        suppliedSymbols: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedNamespace: { type: "string", maxLength: 8192 },
      },
      required: ["symbol", "suppliedSymbols", "suppliedNamespace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192 },
        recognized: { type: "boolean" },
        index: { type: "integer" },
      },
      required: ["namespace", "recognized", "index"],
    },
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSymbols",
          label: "Supplied Symbols",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedNamespace",
          label: "Supplied Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "namespace", label: "Namespace", valueType: { type: "string" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = historicalUnitSymbolTokenTool.execute;
export default historicalUnitSymbolTokenTool;
