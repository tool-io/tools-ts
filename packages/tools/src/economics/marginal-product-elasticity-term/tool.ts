import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputQuantity: number;
  readonly outputQuantity: number;
  readonly suppliedMarginalProduct: number;
};
export type Output = { readonly elasticity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputQuantity: { type: "number", minimum: 0 },
    outputQuantity: { type: "number", exclusiveMinimum: 0 },
    suppliedMarginalProduct: { type: "number" },
  },
  required: ["inputQuantity", "outputQuantity", "suppliedMarginalProduct"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elasticity: { type: "number" } },
  required: ["elasticity"],
} as const;
/** Scale a supplied marginal product into a local production elasticity without estimating a production function. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputQuantity, outputQuantity, suppliedMarginalProduct } = request;
  const compute = (): Output => {
    H.domain(inputQuantity >= 0);
    H.positive(outputQuantity);
    const product = suppliedMarginalProduct * inputQuantity;
    return {
      elasticity:
        Number.isFinite(product) &&
        (product !== 0 || suppliedMarginalProduct === 0 || inputQuantity === 0)
          ? product / outputQuantity
          : suppliedMarginalProduct * (inputQuantity / outputQuantity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputQuantity: 4, outputQuantity: 20, suppliedMarginalProduct: 3 },
  output: { elasticity: 0.6 },
} satisfies ToolExample<Input, Output>;
export const marginalProductElasticityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/marginal-product-elasticity-term",
    title: "Marginal Product Elasticity Term Tool",
    description:
      "Scale a supplied marginal product into a local production elasticity without estimating a production function.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputQuantity: { type: "number", minimum: 0 },
        outputQuantity: { type: "number", exclusiveMinimum: 0 },
        suppliedMarginalProduct: { type: "number" },
      },
      required: ["inputQuantity", "outputQuantity", "suppliedMarginalProduct"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elasticity: { type: "number" } },
      required: ["elasticity"],
    },
    ports: {
      inputs: [
        {
          id: "inputQuantity",
          label: "Input Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputQuantity",
          label: "Output Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMarginalProduct",
          label: "Supplied Marginal Product",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elasticity",
          label: "Elasticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marginalProductElasticityTermTool.execute;
export default marginalProductElasticityTermTool;
