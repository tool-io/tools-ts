import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceId: string;
  readonly recordedMeans: string;
  readonly vocabularySource: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedMeans: { type: "string", maxLength: 8192, minLength: 1 },
    vocabularySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["occurrenceId", "recordedMeans", "vocabularySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label a supplied occurrence establishment-means term and its vocabulary source without inferring native or introduced status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceId, recordedMeans, vocabularySource } = request;
  const compute = (): Output => {
    H.domain(
      occurrenceId.length > 0 &&
        recordedMeans.length > 0 &&
        vocabularySource.length > 0,
      "occurrenceId",
    );
    return {
      tag: occurrenceId + " [" + recordedMeans + "; " + vocabularySource + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occurrenceId: "O17",
    recordedMeans: "introduced",
    vocabularySource: "dataset vocabulary",
  },
  output: { tag: "O17 [introduced; dataset vocabulary]" },
} satisfies ToolExample<Input, Output>;
export const occurrenceEstablishmentMeansTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/occurrence-establishment-means-tag",
    title: "Occurrence Establishment Means Tag",
    description:
      "Label a supplied occurrence establishment-means term and its vocabulary source without inferring native or introduced status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedMeans: { type: "string", maxLength: 8192, minLength: 1 },
        vocabularySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["occurrenceId", "recordedMeans", "vocabularySource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "occurrenceId",
          label: "Occurrence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedMeans",
          label: "Recorded Means",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vocabularySource",
          label: "Vocabulary Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = occurrenceEstablishmentMeansTagTool.execute;
export default occurrenceEstablishmentMeansTagTool;
