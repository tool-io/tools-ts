import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxPerUnit: number;
  readonly quantityReduction: number;
};
export type Output = { readonly loss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxPerUnit: { type: "number", minimum: 0 },
    quantityReduction: { type: "number", minimum: 0 },
  },
  required: ["taxPerUnit", "quantityReduction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loss: { type: "number" } },
  required: ["loss"],
} as const;
/** Compute the local linear triangle approximation from an explicit tax wedge and quantity reduction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxPerUnit, quantityReduction } = request;
  const compute = (): Output => {
    H.domain(taxPerUnit >= 0 && quantityReduction >= 0);
    return { loss: (taxPerUnit * quantityReduction) / 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taxPerUnit: 4, quantityReduction: 20 },
  output: { loss: 40 },
} satisfies ToolExample<Input, Output>;
export const deadweightLossTriangleSmallTaxTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/deadweight-loss-triangle-small-tax",
    title: "Deadweight Loss Triangle Small Tax Tool",
    description:
      "Compute the local linear triangle approximation from an explicit tax wedge and quantity reduction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxPerUnit: { type: "number", minimum: 0 },
        quantityReduction: { type: "number", minimum: 0 },
      },
      required: ["taxPerUnit", "quantityReduction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loss: { type: "number" } },
      required: ["loss"],
    },
    ports: {
      inputs: [
        {
          id: "taxPerUnit",
          label: "Tax Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantityReduction",
          label: "Quantity Reduction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "loss", label: "Loss", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = deadweightLossTriangleSmallTaxTool.execute;
export default deadweightLossTriangleSmallTaxTool;
