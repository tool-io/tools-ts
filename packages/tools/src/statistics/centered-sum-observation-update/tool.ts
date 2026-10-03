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
  readonly value: number;
};
export type Output = {
  readonly count: number;
  readonly mean: number;
  readonly m2: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1 },
    mean: { type: "number" },
    m2: { type: "number" },
    value: { type: "number" },
  },
  required: ["count", "mean", "m2", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer" },
    mean: { type: "number" },
    m2: { type: "number" },
  },
  required: ["count", "mean", "m2"],
} as const;
/** Compute centered sum observation update from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { count, mean, m2, value } = input;
  const compute = (): Output => {
    integer(count, 1);
    domain(m2 >= 0);
    const d = value - mean,
      n = count + 1,
      next = mean + d / n;
    return { count: n, mean: next, m2: m2 + d * (value - next) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 2, mean: 3, m2: 2, value: 6 },
  output: { count: 3, mean: 4, m2: 8 },
} satisfies ToolExample<Input, Output>;
export const centeredSumObservationUpdateTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/centered-sum-observation-update",
  title: "Centered Sum Observation Update Tool",
  description:
    "Compute centered sum observation update from explicit bounded inputs.",
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
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "count", label: "Count", valueType: { type: "integer" } },
      { id: "mean", label: "Mean", valueType: { type: "number" } },
      { id: "m2", label: "M2", valueType: { type: "number" } },
    ],
  },
});
export const run = centeredSumObservationUpdateTool.execute;
export default centeredSumObservationUpdateTool;
