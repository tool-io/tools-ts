import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly variance: number; readonly tolerance: number };
export type Output = { readonly variance: number; readonly clamped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { variance: { type: "number" }, tolerance: { type: "number" } },
  required: ["variance", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { variance: { type: "number" }, clamped: { type: "boolean" } },
  required: ["variance", "clamped"],
} as const;
/** Compute variance negative roundoff tolerance from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { variance, tolerance } = input;
  const compute = (): Output => {
    domain(tolerance >= 0 && variance >= -tolerance);
    return { variance: Math.max(0, variance), clamped: variance < 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { variance: -0.00001, tolerance: 0.0001 },
  output: { variance: 0, clamped: true },
} satisfies ToolExample<Input, Output>;
export const varianceNegativeRoundoffToleranceTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/variance-negative-roundoff-tolerance",
  title: "Variance Negative Roundoff Tolerance Tool",
  description:
    "Compute variance negative roundoff tolerance from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "variance",
        label: "Variance",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "tolerance",
        label: "Tolerance",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "variance", label: "Variance", valueType: { type: "number" } },
      { id: "clamped", label: "Clamped", valueType: { type: "boolean" } },
    ],
  },
});
export const run = varianceNegativeRoundoffToleranceTool.execute;
export default varianceNegativeRoundoffToleranceTool;
