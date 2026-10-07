import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationTime: number;
  readonly modelStartTime: number;
  readonly referenceDuration: number;
};
export type Output = { readonly normalizedTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationTime: { type: "number" },
    modelStartTime: { type: "number" },
    referenceDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observationTime", "modelStartTime", "referenceDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedTime: { type: "number" } },
  required: ["normalizedTime"],
} as const;
/** Place an explicit observation time on a model’s supplied origin and positive reference-duration scale, allowing pre-origin observations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationTime, modelStartTime, referenceDuration } = request;
  const compute = (): Output => {
    (H.domain(referenceDuration > 0, "referenceDuration"), referenceDuration);
    return {
      normalizedTime: (observationTime - modelStartTime) / referenceDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationTime: 15, modelStartTime: 10, referenceDuration: 20 },
  output: { normalizedTime: 0.25 },
} satisfies ToolExample<Input, Output>;
export const modelObservationNormalizedTimePointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["computational-biology", "computational biology", "biology"],
        keywords: ["computational biology", "biology"],
      },
      id: "computational-biology/model-observation-normalized-time-point",
      title: "Model Observation Normalized Time Point",
      description:
        "Place an explicit observation time on a model’s supplied origin and positive reference-duration scale, allowing pre-origin observations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationTime: { type: "number" },
          modelStartTime: { type: "number" },
          referenceDuration: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observationTime", "modelStartTime", "referenceDuration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalizedTime: { type: "number" } },
        required: ["normalizedTime"],
      },
      ports: {
        inputs: [
          {
            id: "observationTime",
            label: "Observation Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "modelStartTime",
            label: "Model Start Time",
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
            id: "normalizedTime",
            label: "Normalized Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = modelObservationNormalizedTimePointTool.execute;
export default modelObservationNormalizedTimePointTool;
