import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slideId: string;
  readonly annotationCode: string;
  readonly annotationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slideId: { type: "string", maxLength: 8192, minLength: 1 },
    annotationCode: { type: "string", maxLength: 8192, minLength: 1 },
    annotationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["slideId", "annotationCode", "annotationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit histology annotation by its recorded source without generating annotations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slideId, annotationCode, annotationSource } = request;
  const compute = (): Output => {
    H.domain(slideId.length > 0, "slideId");
    H.domain(annotationCode.length > 0, "annotationCode");
    H.domain(annotationSource.length > 0, "annotationSource");
    return {
      token: JSON.stringify([slideId, annotationCode, annotationSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    slideId: "SL17",
    annotationCode: "REG-A",
    annotationSource: "Rater 2",
  },
  output: { token: '["SL17","REG-A","Rater 2"]' },
} satisfies ToolExample<Input, Output>;
export const histologyAnnotationSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/histology-annotation-source-label",
    title: "Histology Annotation Source Label",
    description:
      "Qualify an explicit histology annotation by its recorded source without generating annotations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slideId: { type: "string", maxLength: 8192, minLength: 1 },
        annotationCode: { type: "string", maxLength: 8192, minLength: 1 },
        annotationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["slideId", "annotationCode", "annotationSource"],
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
          id: "annotationCode",
          label: "Annotation Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "annotationSource",
          label: "Annotation Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = histologyAnnotationSourceLabelTool.execute;
export default histologyAnnotationSourceLabelTool;
