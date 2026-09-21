import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominal: number;
  readonly sourceIndex: number;
  readonly targetIndex: number;
};
export type Output = { readonly factor: number; readonly adjusted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominal: { type: "number" },
    sourceIndex: { type: "number", exclusiveMinimum: 0 },
    targetIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nominal", "sourceIndex", "targetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" }, adjusted: { type: "number" } },
  required: ["factor", "adjusted"],
} as const;
/** Rebase a signed monetary amount using two supplied comparable indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominal, sourceIndex, targetIndex } = request;
  const compute = (): Output => {
    H.positive(sourceIndex);
    H.positive(targetIndex);
    return {
      factor: targetIndex / sourceIndex,
      adjusted: (nominal * targetIndex) / sourceIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominal: 100, sourceIndex: 80, targetIndex: 120 },
  output: { factor: 1.5, adjusted: 150 },
} satisfies ToolExample<Input, Output>;
export const agriculturalPolicyPriceYearIndexFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/agricultural-policy-price-year-index-factor",
      title: "Agricultural Policy Price Year Index Factor Tool",
      description:
        "Rebase a signed monetary amount using two supplied comparable indices.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominal: { type: "number" },
          sourceIndex: { type: "number", exclusiveMinimum: 0 },
          targetIndex: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["nominal", "sourceIndex", "targetIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          factor: { type: "number" },
          adjusted: { type: "number" },
        },
        required: ["factor", "adjusted"],
      },
      ports: {
        inputs: [
          {
            id: "nominal",
            label: "Nominal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceIndex",
            label: "Source Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetIndex",
            label: "Target Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "number" } },
          { id: "adjusted", label: "Adjusted", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalPolicyPriceYearIndexFactorTool.execute;
export default agriculturalPolicyPriceYearIndexFactorTool;
