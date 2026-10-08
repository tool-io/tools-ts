import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseDuration: number;
  readonly referenceDuration: number;
};
export type Output = { readonly durationRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseDuration: { type: "number", minimum: 0 },
    referenceDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["responseDuration", "referenceDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationRatio: { type: "number" } },
  required: ["durationRatio"],
} as const;
/** Compare supplied assessment response duration to an explicit positive reference duration without classifying cognitive speed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseDuration, referenceDuration } = request;
  const compute = (): Output => {
    H.domain(responseDuration >= 0, "responseDuration");
    (H.domain(
      Number.isFinite(referenceDuration) && referenceDuration > 0,
      "referenceDuration",
    ),
      referenceDuration);
    return { durationRatio: responseDuration / referenceDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseDuration: 8, referenceDuration: 10 },
  output: { durationRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const assessmentResponseSpeedReferenceRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "educational-psychology/assessment-response-speed-reference-ratio",
      title: "Assessment Response Speed Reference Ratio Tool",
      description:
        "Compare supplied assessment response duration to an explicit positive reference duration without classifying cognitive speed.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseDuration: { type: "number", minimum: 0 },
          referenceDuration: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["responseDuration", "referenceDuration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { durationRatio: { type: "number" } },
        required: ["durationRatio"],
      },
      ports: {
        inputs: [
          {
            id: "responseDuration",
            label: "Response Duration",
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
            id: "durationRatio",
            label: "Duration Ratio",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = assessmentResponseSpeedReferenceRatioTool.execute;
export default assessmentResponseSpeedReferenceRatioTool;
