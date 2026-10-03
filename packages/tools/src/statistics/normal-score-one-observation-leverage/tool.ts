import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly count: number;
  readonly value: number;
  readonly mean: number;
  readonly centeredSumSquares: number;
};
export type Output = { readonly leverage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1 },
    value: { type: "number" },
    mean: { type: "number" },
    centeredSumSquares: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "value", "mean", "centeredSumSquares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leverage: { type: "number" } },
  required: ["leverage"],
} as const;
/** Compute normal score one observation leverage from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { count, value, mean, centeredSumSquares } = input;
  const compute = (): Output => {
    integer(count, 1);
    positive(centeredSumSquares);
    return { leverage: 1 / count + (value - mean) ** 2 / centeredSumSquares };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 4, value: 3, mean: 2, centeredSumSquares: 4 },
  output: { leverage: 0.5 },
} satisfies ToolExample<Input, Output>;
export const normalScoreOneObservationLeverageTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "statistics/normal-score-one-observation-leverage",
  title: "Normal Score One Observation Leverage Tool",
  description:
    "Compute normal score one observation leverage from explicit bounded inputs.",
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
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "mean",
        label: "Mean",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "centeredSumSquares",
        label: "Centered Sum Squares",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "leverage", label: "Leverage", valueType: { type: "number" } },
    ],
  },
});
export const run = normalScoreOneObservationLeverageTool.execute;
export default normalScoreOneObservationLeverageTool;
