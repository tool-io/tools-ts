import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldIndex: number;
  readonly newIndex: number;
  readonly currentRent: number;
};
export type Output = { readonly factor: number; readonly indexedRent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldIndex: { type: "number", exclusiveMinimum: 0 },
    newIndex: { type: "number", exclusiveMinimum: 0 },
    currentRent: { type: "number", minimum: 0 },
  },
  required: ["oldIndex", "newIndex", "currentRent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" }, indexedRent: { type: "number" } },
  required: ["factor", "indexedRent"],
} as const;
/** Apply supplied index values without caps, floors, legal terms or market data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldIndex, newIndex, currentRent } = request;
  const compute = (): Output => {
    H.positive(oldIndex);
    H.positive(newIndex);
    H.domain(currentRent >= 0);
    return {
      factor: newIndex / oldIndex,
      indexedRent: currentRent * (newIndex / oldIndex),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldIndex: 100, newIndex: 105, currentRent: 1000 },
  output: { factor: 1.05, indexedRent: 1050 },
} satisfies ToolExample<Input, Output>;
export const rentReviewIndexRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/rent-review-index-ratio",
    title: "Rent Review Index Ratio Tool",
    description:
      "Apply supplied index values without caps, floors, legal terms or market data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldIndex: { type: "number", exclusiveMinimum: 0 },
        newIndex: { type: "number", exclusiveMinimum: 0 },
        currentRent: { type: "number", minimum: 0 },
      },
      required: ["oldIndex", "newIndex", "currentRent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        factor: { type: "number" },
        indexedRent: { type: "number" },
      },
      required: ["factor", "indexedRent"],
    },
    ports: {
      inputs: [
        {
          id: "oldIndex",
          label: "Old Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newIndex",
          label: "New Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentRent",
          label: "Current Rent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
        {
          id: "indexedRent",
          label: "Indexed Rent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rentReviewIndexRatioTool.execute;
export default rentReviewIndexRatioTool;
