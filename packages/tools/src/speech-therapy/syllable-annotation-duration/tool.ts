import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annotationStart: number;
  readonly annotationEnd: number;
  readonly suppliedSecondsPerUnit: number;
};
export type Output = { readonly durationSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotationStart: { type: "number" },
    annotationEnd: { type: "number" },
    suppliedSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["annotationStart", "annotationEnd", "suppliedSecondsPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationSeconds: { type: "number" } },
  required: ["durationSeconds"],
} as const;
/** Measure an already supplied syllable annotation interval without inferring linguistic or clinical properties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annotationStart, annotationEnd, suppliedSecondsPerUnit } = request;
  const compute = (): Output => {
    H.domain(annotationEnd >= annotationStart);
    H.positive(suppliedSecondsPerUnit);
    return {
      durationSeconds:
        (annotationEnd - annotationStart) * suppliedSecondsPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annotationStart: 10,
    annotationEnd: 15,
    suppliedSecondsPerUnit: 0.1,
  },
  output: { durationSeconds: 0.5 },
} satisfies ToolExample<Input, Output>;
export const syllableAnnotationDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/syllable-annotation-duration",
    title: "Syllable Annotation Duration Tool",
    description:
      "Measure an already supplied syllable annotation interval without inferring linguistic or clinical properties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annotationStart: { type: "number" },
        annotationEnd: { type: "number" },
        suppliedSecondsPerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["annotationStart", "annotationEnd", "suppliedSecondsPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationSeconds: { type: "number" } },
      required: ["durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "annotationStart",
          label: "Annotation Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annotationEnd",
          label: "Annotation End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSecondsPerUnit",
          label: "Supplied Seconds Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = syllableAnnotationDurationTool.execute;
export default syllableAnnotationDurationTool;
