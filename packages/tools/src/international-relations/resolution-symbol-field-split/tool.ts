import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly symbol: string };
export type Output = {
  readonly organ: string;
  readonly series: readonly string[];
  readonly documentNumber: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { symbol: { type: "string", maxLength: 8192 } },
  required: ["symbol"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    organ: { type: "string", maxLength: 8192 },
    series: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    documentNumber: { type: "string", maxLength: 8192 },
  },
  required: ["organ", "series", "documentNumber"],
} as const;
/** Split a slash-delimited resolution-style symbol into first organ token, intermediate series and final document token; no official symbol assignment is verified. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { symbol } = request;
  const compute = (): Output => {
    const parts = symbol.split("/");
    H.domain(parts.length >= 2 && parts.every((p) => p.length > 0), "symbol");
    return {
      organ: parts[0],
      series: parts.slice(1, -1),
      documentNumber: parts[parts.length - 1],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { symbol: "A/RES/78/1" },
  output: { organ: "A", series: ["RES", "78"], documentNumber: "1" },
} satisfies ToolExample<Input, Output>;
export const resolutionSymbolFieldSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/resolution-symbol-field-split",
    title: "Resolution Symbol Field Split Tool",
    description:
      "Split a slash-delimited resolution-style symbol into first organ token, intermediate series and final document token; no official symbol assignment is verified.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { symbol: { type: "string", maxLength: 8192 } },
      required: ["symbol"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        organ: { type: "string", maxLength: 8192 },
        series: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        documentNumber: { type: "string", maxLength: 8192 },
      },
      required: ["organ", "series", "documentNumber"],
    },
    ports: {
      inputs: [
        {
          id: "symbol",
          label: "Symbol",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "organ", label: "Organ", valueType: { type: "string" } },
        {
          id: "series",
          label: "Series",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "documentNumber",
          label: "Document Number",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = resolutionSymbolFieldSplitTool.execute;
export default resolutionSymbolFieldSplitTool;
