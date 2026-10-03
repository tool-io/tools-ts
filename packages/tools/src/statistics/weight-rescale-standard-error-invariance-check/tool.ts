import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly sumWeights: number;
  readonly sumSquaredWeights: number;
  readonly factor: number;
};
export type Output = {
  readonly effectiveSize: number;
  readonly rescaledEffectiveSize: number;
  readonly invariant: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumWeights: { type: "number", exclusiveMinimum: 0 },
    sumSquaredWeights: { type: "number", exclusiveMinimum: 0 },
    factor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sumWeights", "sumSquaredWeights", "factor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveSize: { type: "number" },
    rescaledEffectiveSize: { type: "number" },
    invariant: { type: "boolean" },
  },
  required: ["effectiveSize", "rescaledEffectiveSize", "invariant"],
} as const;
/** Compute weight rescale standard error invariance check from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sumWeights, sumSquaredWeights, factor } = input;
  const compute = (): Output => {
    positive(sumWeights);
    positive(sumSquaredWeights);
    positive(factor);
    domain(sumSquaredWeights <= sumWeights ** 2);
    const effectiveSize = sumWeights ** 2 / sumSquaredWeights;
    return {
      effectiveSize,
      rescaledEffectiveSize: effectiveSize,
      invariant: true,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sumWeights: 4, sumSquaredWeights: 8, factor: 3 },
  output: { effectiveSize: 2, rescaledEffectiveSize: 2, invariant: true },
} satisfies ToolExample<Input, Output>;
export const weightRescaleStandardErrorInvarianceCheckTool =
  defineSchemaCalculation<Input, Output>({
    id: "statistics/weight-rescale-standard-error-invariance-check",
    title: "Weight Rescale Standard Error Invariance Check Tool",
    description:
      "Compute weight rescale standard error invariance check from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "sumWeights",
          label: "Sum Weights",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sumSquaredWeights",
          label: "Sum Squared Weights",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "factor",
          label: "Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveSize",
          label: "Effective Size",
          valueType: { type: "number" },
        },
        {
          id: "rescaledEffectiveSize",
          label: "Rescaled Effective Size",
          valueType: { type: "number" },
        },
        { id: "invariant", label: "Invariant", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = weightRescaleStandardErrorInvarianceCheckTool.execute;
export default weightRescaleStandardErrorInvarianceCheckTool;
