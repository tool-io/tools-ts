import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
  dot,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly weights: readonly number[] };
export type Output = {
  readonly weightSum: number;
  readonly effectiveDof: number;
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightSum: { type: "number" },
    effectiveDof: { type: "number" },
    valid: { type: "boolean" },
  },
  required: ["weightSum", "effectiveDof", "valid"],
} as const;
/** Compute weighted sample degrees of freedom constraint from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { weights } = input;
  const compute = (): Output => {
    domain(weights.length > 0 && weights.every((x) => x >= 0));
    const weightSum = weights.reduce((a, b) => a + b, 0);
    positive(weightSum);
    const effectiveDof = weightSum - dot(weights, weights) / weightSum;
    return { weightSum, effectiveDof, valid: effectiveDof > 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weights: [1, 1, 2] },
  output: { weightSum: 4, effectiveDof: 2.5, valid: true },
} satisfies ToolExample<Input, Output>;
export const weightedSampleDofConstraintTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/weighted-sample-dof-constraint",
  title: "Weighted Sample Degrees of Freedom Constraint Tool",
  description:
    "Compute weighted sample degrees of freedom constraint from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "weights",
        label: "Weights",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      { id: "weightSum", label: "Weight Sum", valueType: { type: "number" } },
      {
        id: "effectiveDof",
        label: "Effective Dof",
        valueType: { type: "number" },
      },
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
    ],
  },
});
export const run = weightedSampleDofConstraintTool.execute;
export default weightedSampleDofConstraintTool;
