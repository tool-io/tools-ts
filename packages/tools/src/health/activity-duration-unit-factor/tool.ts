import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly duration: number;
  readonly sourceSecondsPerUnit: number;
  readonly targetSecondsPerUnit: number;
};
export type Output = { readonly convertedDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duration: { type: "number", minimum: 0 },
    sourceSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
    targetSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["duration", "sourceSecondsPerUnit", "targetSecondsPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedDuration: { type: "number" } },
  required: ["convertedDuration"],
} as const;
/** Convert an explicitly supplied activity duration between compatible elapsed-time units without exercise recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { duration, sourceSecondsPerUnit, targetSecondsPerUnit } = request;
  const compute = (): Output => {
    H.domain(duration >= 0);
    H.positive(sourceSecondsPerUnit);
    H.positive(targetSecondsPerUnit);
    return {
      convertedDuration:
        (duration * sourceSecondsPerUnit) / targetSecondsPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { duration: 120, sourceSecondsPerUnit: 1, targetSecondsPerUnit: 60 },
  output: { convertedDuration: 2 },
} satisfies ToolExample<Input, Output>;
export const activityDurationUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/activity-duration-unit-factor",
    title: "Activity Duration Unit Factor Tool",
    description:
      "Convert an explicitly supplied activity duration between compatible elapsed-time units without exercise recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duration: { type: "number", minimum: 0 },
        sourceSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
        targetSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["duration", "sourceSecondsPerUnit", "targetSecondsPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedDuration: { type: "number" } },
      required: ["convertedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceSecondsPerUnit",
          label: "Source Seconds Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetSecondsPerUnit",
          label: "Target Seconds Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedDuration",
          label: "Converted Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = activityDurationUnitFactorTool.execute;
export default activityDurationUnitFactorTool;
