import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly costs: readonly number[];
  readonly suppliedIndexFactors: readonly number[];
};
export type Output = {
  readonly adjustedCosts: readonly number[];
  readonly adjustedTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costs: { type: "array", maxItems: 256, items: { type: "number" } },
    suppliedIndexFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["costs", "suppliedIndexFactors"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedCosts: { type: "array", maxItems: 256, items: { type: "number" } },
    adjustedTotal: { type: "number" },
  },
  required: ["adjustedCosts", "adjustedTotal"],
} as const;
/** Apply aligned explicit positive price-index factors to supplied signed health-cost observations without selecting inflation indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { costs, suppliedIndexFactors } = request;
  const compute = (): Output => {
    H.domain(
      costs.length === suppliedIndexFactors.length,
      "suppliedIndexFactors",
    );
    suppliedIndexFactors.forEach(
      (value) => (
        H.domain(Number.isFinite(value) && value > 0, "suppliedIndexFactors"),
        value
      ),
    );
    return (() => {
      const adjustedCosts = costs.map(
        (value, index) => value * suppliedIndexFactors[index],
      );
      return {
        adjustedCosts,
        adjustedTotal: adjustedCosts.reduce((sum, value) => sum + value, 0),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { costs: [100, 200], suppliedIndexFactors: [1.1, 1.2] },
  output: { adjustedCosts: [110.00000000000001, 240], adjustedTotal: 350 },
} satisfies ToolExample<Input, Output>;
export const healthCostBatchInflationWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/health-cost-batch-inflation-weight-term",
    title: "Health Cost Batch Inflation Weight Term Tool",
    description:
      "Apply aligned explicit positive price-index factors to supplied signed health-cost observations without selecting inflation indices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costs: { type: "array", maxItems: 256, items: { type: "number" } },
        suppliedIndexFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["costs", "suppliedIndexFactors"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedCosts: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        adjustedTotal: { type: "number" },
      },
      required: ["adjustedCosts", "adjustedTotal"],
    },
    ports: {
      inputs: [
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedIndexFactors",
          label: "Supplied Index Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "adjustedCosts",
          label: "Adjusted Costs",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "adjustedTotal",
          label: "Adjusted Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = healthCostBatchInflationWeightTermTool.execute;
export default healthCostBatchInflationWeightTermTool;
