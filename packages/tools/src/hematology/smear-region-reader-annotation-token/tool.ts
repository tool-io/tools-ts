import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slideId: string;
  readonly regionId: string;
  readonly readerId: string;
  readonly annotationText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slideId: { type: "string", maxLength: 8192, minLength: 1 },
    regionId: { type: "string", maxLength: 8192, minLength: 1 },
    readerId: { type: "string", maxLength: 8192, minLength: 1 },
    annotationText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["slideId", "regionId", "readerId", "annotationText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit smear region, reader and annotation text without classifying morphology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slideId, regionId, readerId, annotationText } = request;
  const compute = (): Output => {
    H.domain(slideId.length > 0, "slideId");
    H.domain(regionId.length > 0, "regionId");
    H.domain(readerId.length > 0, "readerId");
    H.domain(annotationText.length > 0, "annotationText");
    return {
      token: JSON.stringify([slideId, regionId, readerId, annotationText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slideId: "S17",
    regionId: "R4",
    readerId: "A2",
    annotationText: "reviewed region",
  },
  output: { token: '["S17","R4","A2","reviewed region"]' },
} satisfies ToolExample<Input, Output>;
export const smearRegionReaderAnnotationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/smear-region-reader-annotation-token",
    title: "Smear Region Reader Annotation Token Tool",
    description:
      "Preserve explicit smear region, reader and annotation text without classifying morphology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slideId: { type: "string", maxLength: 8192, minLength: 1 },
        regionId: { type: "string", maxLength: 8192, minLength: 1 },
        readerId: { type: "string", maxLength: 8192, minLength: 1 },
        annotationText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["slideId", "regionId", "readerId", "annotationText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "slideId",
          label: "Slide Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "regionId",
          label: "Region Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "readerId",
          label: "Reader Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "annotationText",
          label: "Annotation Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = smearRegionReaderAnnotationTokenTool.execute;
export default smearRegionReaderAnnotationTokenTool;
