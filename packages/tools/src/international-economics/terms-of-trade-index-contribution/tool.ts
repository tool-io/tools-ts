import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exportPriceIndex: number;
  readonly importPriceIndex: number;
  readonly suppliedWeight: number;
};
export type Output = {
  readonly ratioIndex: number;
  readonly weightedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportPriceIndex: { type: "number", minimum: 0 },
    importPriceIndex: { type: "number", exclusiveMinimum: 0 },
    suppliedWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["exportPriceIndex", "importPriceIndex", "suppliedWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratioIndex: { type: "number" },
    weightedContribution: { type: "number" },
  },
  required: ["ratioIndex", "weightedContribution"],
} as const;
/** Apply a supplied basket contribution weight to compatible export/import price index ratios. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exportPriceIndex, importPriceIndex, suppliedWeight } = request;
  const compute = (): Output => {
    H.positive(importPriceIndex);
    H.domain(exportPriceIndex >= 0);
    H.probability(suppliedWeight);
    return {
      ratioIndex: (100 * exportPriceIndex) / importPriceIndex,
      weightedContribution:
        ((100 * exportPriceIndex) / importPriceIndex) * suppliedWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exportPriceIndex: 120, importPriceIndex: 100, suppliedWeight: 0.25 },
  output: { ratioIndex: 120, weightedContribution: 30 },
} satisfies ToolExample<Input, Output>;
export const termsOfTradeIndexContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/terms-of-trade-index-contribution",
    title: "Terms Of Trade Index Contribution Tool",
    description:
      "Apply a supplied basket contribution weight to compatible export/import price index ratios.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exportPriceIndex: { type: "number", minimum: 0 },
        importPriceIndex: { type: "number", exclusiveMinimum: 0 },
        suppliedWeight: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["exportPriceIndex", "importPriceIndex", "suppliedWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratioIndex: { type: "number" },
        weightedContribution: { type: "number" },
      },
      required: ["ratioIndex", "weightedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "exportPriceIndex",
          label: "Export Price Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "importPriceIndex",
          label: "Import Price Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ratioIndex",
          label: "Ratio Index",
          valueType: { type: "number" },
        },
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = termsOfTradeIndexContributionTool.execute;
export default termsOfTradeIndexContributionTool;
