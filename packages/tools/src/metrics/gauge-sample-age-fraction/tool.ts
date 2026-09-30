import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTime: number;
  readonly evaluationTime: number;
  readonly freshnessWindow: number;
};
export type Output = {
  readonly age: number;
  readonly fraction: number;
  readonly futureSample: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTime: { type: "number" },
    evaluationTime: { type: "number" },
    freshnessWindow: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleTime", "evaluationTime", "freshnessWindow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: { type: "number" },
    fraction: { type: "number" },
    futureSample: { type: "boolean" },
  },
  required: ["age", "fraction", "futureSample"],
} as const;
/** Calculate gauge sample age fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTime, evaluationTime, freshnessWindow } = request;
  const compute = (): Output => {
    H.positive(freshnessWindow);
    return {
      age: evaluationTime - sampleTime,
      fraction: (evaluationTime - sampleTime) / freshnessWindow,
      futureSample: sampleTime > evaluationTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleTime: 90, evaluationTime: 100, freshnessWindow: 20 },
  output: { age: 10, fraction: 0.5, futureSample: false },
} satisfies ToolExample<Input, Output>;
export const gaugeSampleAgeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/gauge-sample-age-fraction",
    title: "Gauge Sample Age Fraction Tool",
    description:
      "Calculate gauge sample age fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTime: { type: "number" },
        evaluationTime: { type: "number" },
        freshnessWindow: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleTime", "evaluationTime", "freshnessWindow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        age: { type: "number" },
        fraction: { type: "number" },
        futureSample: { type: "boolean" },
      },
      required: ["age", "fraction", "futureSample"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTime",
          label: "Sample Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaluationTime",
          label: "Evaluation Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freshnessWindow",
          label: "Freshness Window",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "age", label: "Age", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "futureSample",
          label: "Future Sample",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaugeSampleAgeFractionTool.execute;
export default gaugeSampleAgeFractionTool;
