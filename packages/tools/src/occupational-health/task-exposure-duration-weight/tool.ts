import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposureLevel: number;
  readonly duration: number;
  readonly referenceDuration: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureLevel: { type: "number" },
    duration: { type: "number", minimum: 0 },
    referenceDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exposureLevel", "duration", "referenceDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Return one supplied research duration-weighted exposure term; no occupational limit or compliance determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposureLevel, duration, referenceDuration } = request;
  const compute = (): Output => {
    H.domain(duration >= 0);
    H.positive(referenceDuration);
    return { contribution: (exposureLevel * duration) / referenceDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposureLevel: 4, duration: 2, referenceDuration: 8 },
  output: { contribution: 1 },
} satisfies ToolExample<Input, Output>;
export const taskExposureDurationWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/task-exposure-duration-weight",
    title: "Task Exposure Duration Weight Tool",
    description:
      "Return one supplied research duration-weighted exposure term; no occupational limit or compliance determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureLevel: { type: "number" },
        duration: { type: "number", minimum: 0 },
        referenceDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exposureLevel", "duration", "referenceDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "exposureLevel",
          label: "Exposure Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "duration",
          label: "Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDuration",
          label: "Reference Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskExposureDurationWeightTool.execute;
export default taskExposureDurationWeightTool;
