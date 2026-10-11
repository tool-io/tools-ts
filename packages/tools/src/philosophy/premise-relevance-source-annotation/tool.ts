import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly premiseId: string;
  readonly suppliedRelevanceWording: string;
  readonly annotationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    premiseId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRelevanceWording: { type: "string", maxLength: 8192, minLength: 1 },
    annotationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["premiseId", "suppliedRelevanceWording", "annotationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit premise-relevance annotation and source without determining relevance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { premiseId, suppliedRelevanceWording, annotationSource } = request;
  const compute = (): Output => {
    H.domain(premiseId.length > 0, "premiseId");
    H.domain(suppliedRelevanceWording.length > 0, "suppliedRelevanceWording");
    H.domain(annotationSource.length > 0, "annotationSource");
    return {
      token: JSON.stringify([
        premiseId,
        suppliedRelevanceWording,
        annotationSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    premiseId: "P17",
    suppliedRelevanceWording: "relevant to claim A",
    annotationSource: "Rater A",
  },
  output: { token: '["P17","relevant to claim A","Rater A"]' },
} satisfies ToolExample<Input, Output>;
export const premiseRelevanceSourceAnnotationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["philosophy"],
      keywords: ["philosophy"],
    },
    id: "philosophy/premise-relevance-source-annotation",
    title: "Premise Relevance Source Annotation",
    description:
      "Preserve an explicit premise-relevance annotation and source without determining relevance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        premiseId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRelevanceWording: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        annotationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["premiseId", "suppliedRelevanceWording", "annotationSource"],
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
          id: "premiseId",
          label: "Premise Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRelevanceWording",
          label: "Supplied Relevance Wording",
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
export const run = premiseRelevanceSourceAnnotationTool.execute;
export default premiseRelevanceSourceAnnotationTool;
