import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly count: number;
  readonly mean: number;
  readonly m2: number;
  readonly removed: number;
};
export type Output = {
  readonly count: number;
  readonly mean: number;
  readonly m2: number;
  readonly variance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 3 },
    mean: { type: "number" },
    m2: { type: "number" },
    removed: { type: "number" },
  },
  required: ["count", "mean", "m2", "removed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    mean: { type: "number" },
    m2: { type: "number" },
    variance: { type: "number" },
  },
  required: ["count", "mean", "m2", "variance"],
} as const;
/** Compute sample variance one point deletion term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { count, mean, m2, removed } = input;
  const compute = (): Output => {
    integer(count, 3);
    domain(m2 >= 0);
    const n = count - 1,
      next = (count * mean - removed) / n,
      newM2 = m2 - (removed - mean) * (removed - next);
    domain(newM2 >= -1e-10);
    return {
      count: n,
      mean: next,
      m2: Math.max(0, newM2),
      variance: Math.max(0, newM2) / (n - 1),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 3, mean: 4, m2: 8, removed: 6 },
  output: { count: 2, mean: 3, m2: 2, variance: 2 },
} satisfies ToolExample<Input, Output>;
export const sampleVarianceOnePointDeletionTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/sample-variance-one-point-deletion-term",
  title: "Sample Variance One Point Deletion Term Tool",
  description:
    "Compute sample variance one point deletion term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "count",
        label: "Count",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "mean",
        label: "Mean",
        required: true,
        valueType: { type: "number" },
      },
      { id: "m2", label: "M2", required: true, valueType: { type: "number" } },
      {
        id: "removed",
        label: "Removed",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "count", label: "Count", valueType: { type: "integer" } },
      { id: "mean", label: "Mean", valueType: { type: "number" } },
      { id: "m2", label: "M2", valueType: { type: "number" } },
      { id: "variance", label: "Variance", valueType: { type: "number" } },
    ],
  },
});
export const run = sampleVarianceOnePointDeletionTermTool.execute;
export default sampleVarianceOnePointDeletionTermTool;
