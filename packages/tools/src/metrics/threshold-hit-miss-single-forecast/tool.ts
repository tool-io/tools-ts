import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actual: number;
  readonly predicted: number;
  readonly threshold: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly hit: boolean;
  readonly falseAlarm: boolean;
  readonly missed: boolean;
  readonly correctNegative: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actual: { type: "number" },
    predicted: { type: "number" },
    threshold: { type: "number" },
    inclusive: { type: "boolean" },
  },
  required: ["actual", "predicted", "threshold", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hit: { type: "boolean" },
    falseAlarm: { type: "boolean" },
    missed: { type: "boolean" },
    correctNegative: { type: "boolean" },
  },
  required: ["hit", "falseAlarm", "missed", "correctNegative"],
} as const;
/** Calculate threshold hit miss single forecast from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actual, predicted, threshold, inclusive } = request;
  const compute = (): Output => {
    const a = inclusive ? actual >= threshold : actual > threshold,
      p = inclusive ? predicted >= threshold : predicted > threshold;
    return {
      hit: a && p,
      falseAlarm: !a && p,
      missed: a && !p,
      correctNegative: !a && !p,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actual: 12, predicted: 8, threshold: 10, inclusive: true },
  output: {
    hit: false,
    falseAlarm: false,
    missed: true,
    correctNegative: false,
  },
} satisfies ToolExample<Input, Output>;
export const thresholdHitMissSingleForecastTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/threshold-hit-miss-single-forecast",
    title: "Threshold Hit Miss Single Forecast Tool",
    description:
      "Calculate threshold hit miss single forecast from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actual: { type: "number" },
        predicted: { type: "number" },
        threshold: { type: "number" },
        inclusive: { type: "boolean" },
      },
      required: ["actual", "predicted", "threshold", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hit: { type: "boolean" },
        falseAlarm: { type: "boolean" },
        missed: { type: "boolean" },
        correctNegative: { type: "boolean" },
      },
      required: ["hit", "falseAlarm", "missed", "correctNegative"],
    },
    ports: {
      inputs: [
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predicted",
          label: "Predicted",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "hit", label: "Hit", valueType: { type: "boolean" } },
        {
          id: "falseAlarm",
          label: "False Alarm",
          valueType: { type: "boolean" },
        },
        { id: "missed", label: "Missed", valueType: { type: "boolean" } },
        {
          id: "correctNegative",
          label: "Correct Negative",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = thresholdHitMissSingleForecastTool.execute;
export default thresholdHitMissSingleForecastTool;
