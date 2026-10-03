import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupSizes: readonly number[];
  readonly sampleVariances: readonly number[];
};
export type Output = {
  readonly sumSquares: number;
  readonly degreesOfFreedom: number;
  readonly pooledVariance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupSizes: { type: "array", maxItems: 256, items: { type: "integer" } },
    sampleVariances: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["groupSizes", "sampleVariances"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sumSquares: { type: "number" },
    degreesOfFreedom: { type: "integer" },
    pooledVariance: { type: "number" },
  },
  required: ["sumSquares", "degreesOfFreedom", "pooledVariance"],
} as const;
/** Pool supplied unbiased sample variances with n−1 degrees-of-freedom weights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupSizes, sampleVariances } = request;
  const compute = (): Output => {
    H.sameLength(groupSizes, sampleVariances);
    H.domain(
      groupSizes.length > 0 &&
        groupSizes.every((x) => x >= 2) &&
        sampleVariances.every((x) => x >= 0),
    );
    return {
      sumSquares: sampleVariances.reduce(
        (a, b, i) => a + (groupSizes[i] - 1) * b,
        0,
      ),
      degreesOfFreedom: groupSizes.reduce((a, b) => a + b - 1, 0),
      pooledVariance:
        sampleVariances.reduce((a, b, i) => a + (groupSizes[i] - 1) * b, 0) /
        groupSizes.reduce((a, b) => a + b - 1, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupSizes: [3, 5], sampleVariances: [4, 9] },
  output: {
    sumSquares: 44,
    degreesOfFreedom: 6,
    pooledVariance: 7.333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const pooledWithinGroupSumSquaresTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/pooled-within-group-sum-squares",
    title: "Pooled Within Group Sum Squares Tool",
    description:
      "Pool supplied unbiased sample variances with n−1 degrees-of-freedom weights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupSizes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        sampleVariances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["groupSizes", "sampleVariances"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumSquares: { type: "number" },
        degreesOfFreedom: { type: "integer" },
        pooledVariance: { type: "number" },
      },
      required: ["sumSquares", "degreesOfFreedom", "pooledVariance"],
    },
    ports: {
      inputs: [
        {
          id: "groupSizes",
          label: "Group Sizes",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "sampleVariances",
          label: "Sample Variances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "sumSquares",
          label: "Sum Squares",
          valueType: { type: "number" },
        },
        {
          id: "degreesOfFreedom",
          label: "Degrees Of Freedom",
          valueType: { type: "integer" },
        },
        {
          id: "pooledVariance",
          label: "Pooled Variance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pooledWithinGroupSumSquaresTool.execute;
export default pooledWithinGroupSumSquaresTool;
