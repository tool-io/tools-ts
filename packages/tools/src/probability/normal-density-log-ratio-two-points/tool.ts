import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly mean: number;
  readonly deviation: number;
};
export type Output = { readonly logRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    mean: { type: "number" },
    deviation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second", "mean", "deviation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logRatio: { type: "number" } },
  required: ["logRatio"],
} as const;
/** Calculate normal density log ratio two points from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, mean, deviation } = request;
  const compute = (): Output => {
    H.positive(deviation);
    return {
      logRatio:
        ((second - mean) ** 2 - (first - mean) ** 2) /
        (2 * deviation * deviation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 1, second: 3, mean: 0, deviation: 2 },
  output: { logRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const normalDensityLogRatioTwoPointsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/normal-density-log-ratio-two-points",
    title: "Normal Density Log Ratio Two Points Tool",
    description:
      "Calculate normal density log ratio two points from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        mean: { type: "number" },
        deviation: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second", "mean", "deviation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logRatio: { type: "number" } },
      required: ["logRatio"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
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
          id: "deviation",
          label: "Deviation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logRatio", label: "Log Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = normalDensityLogRatioTwoPointsTool.execute;
export default normalDensityLogRatioTwoPointsTool;
