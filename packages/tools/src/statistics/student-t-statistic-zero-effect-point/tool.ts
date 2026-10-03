import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly estimate: number;
  readonly nullValue: number;
  readonly standardError: number;
};
export type Output = {
  readonly statistic: number;
  readonly zeroEffect: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimate: { type: "number" },
    nullValue: { type: "number" },
    standardError: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["estimate", "nullValue", "standardError"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statistic: { type: "number" },
    zeroEffect: { type: "boolean" },
  },
  required: ["statistic", "zeroEffect"],
} as const;
/** Calculate student t statistic zero effect point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimate, nullValue, standardError } = request;
  const compute = (): Output => {
    H.positive(standardError);
    const effect = estimate - nullValue;
    return { statistic: effect / standardError, zeroEffect: effect === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { estimate: 5, nullValue: 3, standardError: 0.5 },
  output: { statistic: 4, zeroEffect: false },
} satisfies ToolExample<Input, Output>;
export const studentTStatisticZeroEffectPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/student-t-statistic-zero-effect-point",
    title: "Student T Statistic Zero Effect Point Tool",
    description:
      "Calculate student t statistic zero effect point from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimate: { type: "number" },
        nullValue: { type: "number" },
        standardError: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["estimate", "nullValue", "standardError"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        statistic: { type: "number" },
        zeroEffect: { type: "boolean" },
      },
      required: ["statistic", "zeroEffect"],
    },
    ports: {
      inputs: [
        {
          id: "estimate",
          label: "Estimate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nullValue",
          label: "Null Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardError",
          label: "Standard Error",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "statistic", label: "Statistic", valueType: { type: "number" } },
        {
          id: "zeroEffect",
          label: "Zero Effect",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = studentTStatisticZeroEffectPointTool.execute;
export default studentTStatisticZeroEffectPointTool;
