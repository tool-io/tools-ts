import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly included: readonly boolean[];
  readonly targetWeight: number;
};
export type Output = {
  readonly totalWeight: number;
  readonly includedWeight: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
    targetWeight: { type: "number", minimum: 0 },
  },
  required: ["weights", "included", "targetWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWeight: { type: "number" },
    includedWeight: { type: "number" },
    residual: { type: "number" },
  },
  required: ["totalWeight", "includedWeight", "residual"],
} as const;
/** Calculate policy indicator weight residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, included, targetWeight } = request;
  const compute = (): Output => {
    H.sameLength(weights, included);
    H.domain(weights.every((x) => x >= 0) && targetWeight >= 0);
    return (() => {
      const totalWeight = weights.reduce((a, b) => a + b, 0),
        includedWeight = weights.reduce(
          (s, w, i) => s + (included[i] ? w : 0),
          0,
        );
      return {
        totalWeight,
        includedWeight,
        residual: targetWeight - includedWeight,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [2, 3], included: [true, false], targetWeight: 4 },
  output: { totalWeight: 5, includedWeight: 2, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const policyIndicatorWeightResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-indicator-weight-residual",
    title: "Policy Indicator Weight Residual Tool",
    description:
      "Calculate policy indicator weight residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
        targetWeight: { type: "number", minimum: 0 },
      },
      required: ["weights", "included", "targetWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalWeight: { type: "number" },
        includedWeight: { type: "number" },
        residual: { type: "number" },
      },
      required: ["totalWeight", "includedWeight", "residual"],
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
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "targetWeight",
          label: "Target Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalWeight",
          label: "Total Weight",
          valueType: { type: "number" },
        },
        {
          id: "includedWeight",
          label: "Included Weight",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = policyIndicatorWeightResidualTool.execute;
export default policyIndicatorWeightResidualTool;
