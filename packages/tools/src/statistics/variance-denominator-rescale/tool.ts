import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly variance: number;
  readonly oldDenominator: number;
  readonly newDenominator: number;
};
export type Output = { readonly rescaledVariance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variance: { type: "number", minimum: 0 },
    oldDenominator: { type: "number", exclusiveMinimum: 0 },
    newDenominator: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["variance", "oldDenominator", "newDenominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rescaledVariance: { type: "number" } },
  required: ["rescaledVariance"],
} as const;
/** Calculate variance denominator rescale from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { variance, oldDenominator, newDenominator } = request;
  const compute = (): Output => {
    H.domain(variance >= 0);
    H.positive(oldDenominator);
    H.positive(newDenominator);
    return { rescaledVariance: (variance * oldDenominator) / newDenominator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { variance: 4, oldDenominator: 3, newDenominator: 4 },
  output: { rescaledVariance: 3 },
} satisfies ToolExample<Input, Output>;
export const varianceDenominatorRescaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/variance-denominator-rescale",
    title: "Variance Denominator Rescale Tool",
    description:
      "Calculate variance denominator rescale from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variance: { type: "number", minimum: 0 },
        oldDenominator: { type: "number", exclusiveMinimum: 0 },
        newDenominator: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["variance", "oldDenominator", "newDenominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rescaledVariance: { type: "number" } },
      required: ["rescaledVariance"],
    },
    ports: {
      inputs: [
        {
          id: "variance",
          label: "Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldDenominator",
          label: "Old Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newDenominator",
          label: "New Denominator",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rescaledVariance",
          label: "Rescaled Variance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = varianceDenominatorRescaleTool.execute;
export default varianceDenominatorRescaleTool;
