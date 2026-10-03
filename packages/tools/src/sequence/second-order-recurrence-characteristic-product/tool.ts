import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCoefficient: number;
  readonly secondCoefficient: number;
};
export type Output = { readonly rootSum: number; readonly rootProduct: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoefficient: { type: "number" },
    secondCoefficient: { type: "number" },
  },
  required: ["firstCoefficient", "secondCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rootSum: { type: "number" }, rootProduct: { type: "number" } },
  required: ["rootSum", "rootProduct"],
} as const;
/** For a_n = firstCoefficient*a_(n-1)+secondCoefficient*a_(n-2), return characteristic-root sum and product. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCoefficient, secondCoefficient } = request;
  const compute = (): Output => {
    return { rootSum: firstCoefficient, rootProduct: -secondCoefficient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCoefficient: 3, secondCoefficient: 2 },
  output: { rootSum: 3, rootProduct: -2 },
} satisfies ToolExample<Input, Output>;
export const secondOrderRecurrenceCharacteristicProductTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/second-order-recurrence-characteristic-product",
      title: "Second Order Recurrence Characteristic Product Tool",
      description:
        "For a_n = firstCoefficient*a_(n-1)+secondCoefficient*a_(n-2), return characteristic-root sum and product.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstCoefficient: { type: "number" },
          secondCoefficient: { type: "number" },
        },
        required: ["firstCoefficient", "secondCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rootSum: { type: "number" },
          rootProduct: { type: "number" },
        },
        required: ["rootSum", "rootProduct"],
      },
      ports: {
        inputs: [
          {
            id: "firstCoefficient",
            label: "First Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondCoefficient",
            label: "Second Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "rootSum", label: "Root Sum", valueType: { type: "number" } },
          {
            id: "rootProduct",
            label: "Root Product",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = secondOrderRecurrenceCharacteristicProductTool.execute;
export default secondOrderRecurrenceCharacteristicProductTool;
