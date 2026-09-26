import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intercept: number;
  readonly slope: number;
  readonly quantity: number;
};
export type Output = {
  readonly price: number;
  readonly marginalRevenue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intercept: { type: "number" },
    slope: { type: "number", exclusiveMinimum: 0 },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["intercept", "slope", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number" },
    marginalRevenue: { type: "number" },
  },
  required: ["price", "marginalRevenue"],
} as const;
/** Calculate monopoly linear demand marginal revenue from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intercept, slope, quantity } = request;
  const compute = (): Output => {
    H.positive(slope);
    H.domain(quantity >= 0);
    return {
      price: intercept - slope * quantity,
      marginalRevenue: intercept - 2 * slope * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intercept: 100, slope: 2, quantity: 15 },
  output: { price: 70, marginalRevenue: 40 },
} satisfies ToolExample<Input, Output>;
export const monopolyLinearDemandMarginalRevenueTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/monopoly-linear-demand-marginal-revenue",
      title: "Monopoly Linear Demand Marginal Revenue Tool",
      description:
        "Calculate monopoly linear demand marginal revenue from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intercept: { type: "number" },
          slope: { type: "number", exclusiveMinimum: 0 },
          quantity: { type: "number", minimum: 0 },
        },
        required: ["intercept", "slope", "quantity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          price: { type: "number" },
          marginalRevenue: { type: "number" },
        },
        required: ["price", "marginalRevenue"],
      },
      ports: {
        inputs: [
          {
            id: "intercept",
            label: "Intercept",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "slope",
            label: "Slope",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "quantity",
            label: "Quantity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "price", label: "Price", valueType: { type: "number" } },
          {
            id: "marginalRevenue",
            label: "Marginal Revenue",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = monopolyLinearDemandMarginalRevenueTool.execute;
export default monopolyLinearDemandMarginalRevenueTool;
