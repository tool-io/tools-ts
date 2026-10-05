import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly criterionWeight: number;
  readonly totalWeight: number;
};
export type Output = { readonly normalizedWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    criterionWeight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["criterionWeight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedWeight: { type: "number" } },
  required: ["normalizedWeight"],
} as const;
/** Normalize one explicitly supplied criterion weight by a compatible positive total without selecting ethical priorities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { criterionWeight, totalWeight } = request;
  const compute = (): Output => {
    (H.domain(totalWeight > 0, "totalWeight"), totalWeight);
    H.domain(
      criterionWeight >= 0 && criterionWeight <= totalWeight,
      "criterionWeight",
    );
    return { normalizedWeight: criterionWeight / totalWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { criterionWeight: 3, totalWeight: 12 },
  output: { normalizedWeight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const valueWeightCriterionNormalizerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/value-weight-criterion-normalizer",
    title: "Value Weight Criterion Normalizer Tool",
    description:
      "Normalize one explicitly supplied criterion weight by a compatible positive total without selecting ethical priorities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        criterionWeight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["criterionWeight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalizedWeight: { type: "number" } },
      required: ["normalizedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "criterionWeight",
          label: "Criterion Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedWeight",
          label: "Normalized Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = valueWeightCriterionNormalizerTool.execute;
export default valueWeightCriterionNormalizerTool;
