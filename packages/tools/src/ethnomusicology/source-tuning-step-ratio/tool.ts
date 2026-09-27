import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly steps: number;
  readonly stepsPerPeriod: number;
  readonly periodRatio: number;
};
export type Output = { readonly frequencyRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    steps: { type: "number" },
    stepsPerPeriod: { type: "number", exclusiveMinimum: 0 },
    periodRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["steps", "stepsPerPeriod", "periodRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { frequencyRatio: { type: "number" } },
  required: ["frequencyRatio"],
} as const;
/** Evaluate an explicitly supplied equal-step tuning model without assuming a universal tuning system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { steps, stepsPerPeriod, periodRatio } = request;
  const compute = (): Output => {
    H.positive(stepsPerPeriod);
    H.positive(periodRatio);
    return { frequencyRatio: periodRatio ** (steps / stepsPerPeriod) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { steps: 6, stepsPerPeriod: 12, periodRatio: 2 },
  output: { frequencyRatio: 1.4142135623730951 },
} satisfies ToolExample<Input, Output>;
export const sourceTuningStepRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/source-tuning-step-ratio",
    title: "Source Tuning Step Ratio Tool",
    description:
      "Evaluate an explicitly supplied equal-step tuning model without assuming a universal tuning system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        steps: { type: "number" },
        stepsPerPeriod: { type: "number", exclusiveMinimum: 0 },
        periodRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["steps", "stepsPerPeriod", "periodRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { frequencyRatio: { type: "number" } },
      required: ["frequencyRatio"],
    },
    ports: {
      inputs: [
        {
          id: "steps",
          label: "Steps",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepsPerPeriod",
          label: "Steps Per Period",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodRatio",
          label: "Period Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "frequencyRatio",
          label: "Frequency Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceTuningStepRatioTool.execute;
export default sourceTuningStepRatioTool;
