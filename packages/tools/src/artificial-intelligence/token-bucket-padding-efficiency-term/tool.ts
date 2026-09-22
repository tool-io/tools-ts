import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lengths: readonly number[];
  readonly bucketLength: number;
};
export type Output = {
  readonly actualTokens: number;
  readonly allocatedTokens: number;
  readonly efficiency: number;
  readonly waste: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
    bucketLength: { type: "integer", minimum: 1 },
  },
  required: ["lengths", "bucketLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualTokens: { type: "integer" },
    allocatedTokens: { type: "integer" },
    efficiency: { type: "number" },
    waste: { type: "integer" },
  },
  required: ["actualTokens", "allocatedTokens", "efficiency", "waste"],
} as const;
/** Calculate token bucket padding efficiency term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lengths, bucketLength } = request;
  const compute = (): Output => {
    H.integer(bucketLength, 1);
    H.domain(
      lengths.length > 0 && lengths.every((x) => x >= 0 && x <= bucketLength),
    );
    return {
      actualTokens: lengths.reduce((a, b) => a + b, 0),
      allocatedTokens: lengths.length * bucketLength,
      efficiency:
        lengths.reduce((a, b) => a + b, 0) / (lengths.length * bucketLength),
      waste: lengths.length * bucketLength - lengths.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lengths: [3, 5], bucketLength: 8 },
  output: { actualTokens: 8, allocatedTokens: 16, efficiency: 0.5, waste: 8 },
} satisfies ToolExample<Input, Output>;
export const tokenBucketPaddingEfficiencyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/token-bucket-padding-efficiency-term",
    title: "Token Bucket Padding Efficiency Term Tool",
    description:
      "Calculate token bucket padding efficiency term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
        bucketLength: { type: "integer", minimum: 1 },
      },
      required: ["lengths", "bucketLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualTokens: { type: "integer" },
        allocatedTokens: { type: "integer" },
        efficiency: { type: "number" },
        waste: { type: "integer" },
      },
      required: ["actualTokens", "allocatedTokens", "efficiency", "waste"],
    },
    ports: {
      inputs: [
        {
          id: "lengths",
          label: "Lengths",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "bucketLength",
          label: "Bucket Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "actualTokens",
          label: "Actual Tokens",
          valueType: { type: "integer" },
        },
        {
          id: "allocatedTokens",
          label: "Allocated Tokens",
          valueType: { type: "integer" },
        },
        {
          id: "efficiency",
          label: "Efficiency",
          valueType: { type: "number" },
        },
        { id: "waste", label: "Waste", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = tokenBucketPaddingEfficiencyTermTool.execute;
export default tokenBucketPaddingEfficiencyTermTool;
