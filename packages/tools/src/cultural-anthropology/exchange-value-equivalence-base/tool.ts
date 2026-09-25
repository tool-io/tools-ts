import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly suppliedEquivalence: number;
  readonly referenceQuantity: number;
};
export type Output = {
  readonly equivalentQuantity: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number" },
    suppliedEquivalence: { type: "number", exclusiveMinimum: 0 },
    referenceQuantity: { type: "number" },
  },
  required: ["quantity", "suppliedEquivalence", "referenceQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentQuantity: { type: "number" },
    gap: { type: "number" },
  },
  required: ["equivalentQuantity", "gap"],
} as const;
/** Apply a source-specific supplied exchange equivalence without asserting market value or cultural equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, suppliedEquivalence, referenceQuantity } = request;
  const compute = (): Output => {
    H.positive(suppliedEquivalence);
    return {
      equivalentQuantity: quantity * suppliedEquivalence,
      gap: quantity * suppliedEquivalence - referenceQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 3, suppliedEquivalence: 4, referenceQuantity: 10 },
  output: { equivalentQuantity: 12, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const exchangeValueEquivalenceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/exchange-value-equivalence-base",
    title: "Exchange Value Equivalence Base Tool",
    description:
      "Apply a source-specific supplied exchange equivalence without asserting market value or cultural equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number" },
        suppliedEquivalence: { type: "number", exclusiveMinimum: 0 },
        referenceQuantity: { type: "number" },
      },
      required: ["quantity", "suppliedEquivalence", "referenceQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentQuantity: { type: "number" },
        gap: { type: "number" },
      },
      required: ["equivalentQuantity", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEquivalence",
          label: "Supplied Equivalence",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceQuantity",
          label: "Reference Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentQuantity",
          label: "Equivalent Quantity",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exchangeValueEquivalenceBaseTool.execute;
export default exchangeValueEquivalenceBaseTool;
