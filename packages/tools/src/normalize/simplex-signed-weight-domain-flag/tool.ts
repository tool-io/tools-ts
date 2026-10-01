import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly sum: number;
  readonly nonnegative: boolean;
  readonly normalized: boolean;
  readonly simplex: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["weights", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sum: { type: "number" },
    nonnegative: { type: "boolean" },
    normalized: { type: "boolean" },
    simplex: { type: "boolean" },
  },
  required: ["sum", "nonnegative", "normalized", "simplex"],
} as const;
/** Check nonnegative unit-sum weights under an explicit absolute sum tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      sum: weights.reduce((s, x) => s + x, 0),
      nonnegative: weights.every((x) => x >= 0),
      normalized: Math.abs(weights.reduce((s, x) => s + x, 0) - 1) <= tolerance,
      simplex:
        weights.length > 0 &&
        weights.every((x) => x >= 0) &&
        Math.abs(weights.reduce((s, x) => s + x, 0) - 1) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [0.2, 0.8], tolerance: 0 },
  output: { sum: 1, nonnegative: true, normalized: true, simplex: true },
} satisfies ToolExample<Input, Output>;
export const simplexSignedWeightDomainFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/simplex-signed-weight-domain-flag",
    title: "Simplex Signed Weight Domain Flag Tool",
    description:
      "Check nonnegative unit-sum weights under an explicit absolute sum tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["weights", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sum: { type: "number" },
        nonnegative: { type: "boolean" },
        normalized: { type: "boolean" },
        simplex: { type: "boolean" },
      },
      required: ["sum", "nonnegative", "normalized", "simplex"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sum", label: "Sum", valueType: { type: "number" } },
        {
          id: "nonnegative",
          label: "Nonnegative",
          valueType: { type: "boolean" },
        },
        {
          id: "normalized",
          label: "Normalized",
          valueType: { type: "boolean" },
        },
        { id: "simplex", label: "Simplex", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = simplexSignedWeightDomainFlagTool.execute;
export default simplexSignedWeightDomainFlagTool;
