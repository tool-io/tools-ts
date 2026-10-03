import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousProduct: number;
  readonly currentProduct: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousProduct: { type: "number" },
    currentProduct: { type: "number" },
  },
  required: ["previousProduct", "currentProduct"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Calculate sequence one step cumulative product ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousProduct, currentProduct } = request;
  const compute = (): Output => {
    H.domain(previousProduct !== 0);
    return { factor: currentProduct / previousProduct };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousProduct: 6, currentProduct: 24 },
  output: { factor: 4 },
} satisfies ToolExample<Input, Output>;
export const sequenceOneStepCumulativeProductRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/sequence-one-step-cumulative-product-ratio",
      title: "Sequence One Step Cumulative Product Ratio Tool",
      description:
        "Calculate sequence one step cumulative product ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousProduct: { type: "number" },
          currentProduct: { type: "number" },
        },
        required: ["previousProduct", "currentProduct"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { factor: { type: "number" } },
        required: ["factor"],
      },
      ports: {
        inputs: [
          {
            id: "previousProduct",
            label: "Previous Product",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentProduct",
            label: "Current Product",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = sequenceOneStepCumulativeProductRatioTool.execute;
export default sequenceOneStepCumulativeProductRatioTool;
