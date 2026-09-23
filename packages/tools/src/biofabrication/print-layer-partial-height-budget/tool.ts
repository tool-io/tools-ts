import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fullLayers: number;
  readonly nominalHeight: number;
  readonly partialHeights: readonly number[];
};
export type Output = {
  readonly totalHeight: number;
  readonly partialEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullLayers: { type: "integer", minimum: 0 },
    nominalHeight: { type: "number", exclusiveMinimum: 0 },
    partialHeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["fullLayers", "nominalHeight", "partialHeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalHeight: { type: "number" },
    partialEquivalent: { type: "number" },
  },
  required: ["totalHeight", "partialEquivalent"],
} as const;
/** Supplied generic print-height ledger without biological material fabrication procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fullLayers, nominalHeight, partialHeights } = request;
  const compute = (): Output => {
    H.integer(fullLayers, 0);
    H.positive(nominalHeight);
    H.domain(partialHeights.every((x) => x >= 0 && x <= nominalHeight));
    return {
      totalHeight:
        fullLayers * nominalHeight + partialHeights.reduce((a, b) => a + b, 0),
      partialEquivalent:
        partialHeights.reduce((a, b) => a + b, 0) / nominalHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fullLayers: 10, nominalHeight: 0.2, partialHeights: [0.1, 0.05] },
  output: { totalHeight: 2.15, partialEquivalent: 0.7500000000000001 },
} satisfies ToolExample<Input, Output>;
export const printLayerPartialHeightBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/print-layer-partial-height-budget",
    title: "Print Layer Partial Height Budget Tool",
    description:
      "Supplied generic print-height ledger without biological material fabrication procedures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullLayers: { type: "integer", minimum: 0 },
        nominalHeight: { type: "number", exclusiveMinimum: 0 },
        partialHeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["fullLayers", "nominalHeight", "partialHeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalHeight: { type: "number" },
        partialEquivalent: { type: "number" },
      },
      required: ["totalHeight", "partialEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "fullLayers",
          label: "Full Layers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nominalHeight",
          label: "Nominal Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialHeights",
          label: "Partial Heights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalHeight",
          label: "Total Height",
          valueType: { type: "number" },
        },
        {
          id: "partialEquivalent",
          label: "Partial Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printLayerPartialHeightBudgetTool.execute;
export default printLayerPartialHeightBudgetTool;
