import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annotatedArea: number;
  readonly imageArea: number;
  readonly excludedArea: number;
  readonly overlapWithExcluded: number;
};
export type Output = {
  readonly eligibleAnnotation: number;
  readonly eligibleImage: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annotatedArea: { type: "number", minimum: 0 },
    imageArea: { type: "number" },
    excludedArea: { type: "number", minimum: 0 },
    overlapWithExcluded: { type: "number", minimum: 0 },
  },
  required: [
    "annotatedArea",
    "imageArea",
    "excludedArea",
    "overlapWithExcluded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleAnnotation: { type: "number" },
    eligibleImage: { type: "number" },
    share: { type: "number" },
  },
  required: ["eligibleAnnotation", "eligibleImage", "share"],
} as const;
/** Audit supplied image-annotation areas without detecting or diagnosing lesions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annotatedArea, imageArea, excludedArea, overlapWithExcluded } =
    request;
  const compute = (): Output => {
    H.domain(
      imageArea > excludedArea &&
        excludedArea >= 0 &&
        annotatedArea >= 0 &&
        annotatedArea <= imageArea &&
        overlapWithExcluded >= 0 &&
        overlapWithExcluded <= Math.min(annotatedArea, excludedArea) &&
        annotatedArea - overlapWithExcluded <= imageArea - excludedArea,
    );
    return {
      eligibleAnnotation: annotatedArea - overlapWithExcluded,
      eligibleImage: imageArea - excludedArea,
      share: (annotatedArea - overlapWithExcluded) / (imageArea - excludedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    annotatedArea: 30,
    imageArea: 100,
    excludedArea: 20,
    overlapWithExcluded: 10,
  },
  output: { eligibleAnnotation: 20, eligibleImage: 80, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const lesionAnnotationAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/lesion-annotation-area-share",
    title: "Lesion Annotation Area Share Tool",
    description:
      "Audit supplied image-annotation areas without detecting or diagnosing lesions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annotatedArea: { type: "number", minimum: 0 },
        imageArea: { type: "number" },
        excludedArea: { type: "number", minimum: 0 },
        overlapWithExcluded: { type: "number", minimum: 0 },
      },
      required: [
        "annotatedArea",
        "imageArea",
        "excludedArea",
        "overlapWithExcluded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleAnnotation: { type: "number" },
        eligibleImage: { type: "number" },
        share: { type: "number" },
      },
      required: ["eligibleAnnotation", "eligibleImage", "share"],
    },
    ports: {
      inputs: [
        {
          id: "annotatedArea",
          label: "Annotated Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imageArea",
          label: "Image Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapWithExcluded",
          label: "Overlap With Excluded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleAnnotation",
          label: "Eligible Annotation",
          valueType: { type: "number" },
        },
        {
          id: "eligibleImage",
          label: "Eligible Image",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lesionAnnotationAreaShareTool.execute;
export default lesionAnnotationAreaShareTool;
