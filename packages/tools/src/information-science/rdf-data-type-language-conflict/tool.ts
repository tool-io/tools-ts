import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly datatype: string; readonly language: string };
export type Output = {
  readonly hasLanguage: boolean;
  readonly conflictingDatatype: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datatype: { type: "string", maxLength: 8192 },
    language: { type: "string", maxLength: 8192 },
  },
  required: ["datatype", "language"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasLanguage: { type: "boolean" },
    conflictingDatatype: { type: "boolean" },
  },
  required: ["hasLanguage", "conflictingDatatype"],
} as const;
/** Detect a supplied language-tag/datatype conflict without validating literal lexical space or fetching vocabularies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { datatype, language } = request;
  const compute = (): Output => {
    const hasLanguage = language.length > 0;
    return {
      hasLanguage,
      conflictingDatatype:
        hasLanguage &&
        datatype !== "" &&
        datatype !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    datatype: "http://www.w3.org/2001/XMLSchema#string",
    language: "en",
  },
  output: { hasLanguage: true, conflictingDatatype: true },
} satisfies ToolExample<Input, Output>;
export const rdfDataTypeLanguageConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/rdf-data-type-language-conflict",
    title: "RDF Data Type Language Conflict Tool",
    description:
      "Detect a supplied language-tag/datatype conflict without validating literal lexical space or fetching vocabularies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datatype: { type: "string", maxLength: 8192 },
        language: { type: "string", maxLength: 8192 },
      },
      required: ["datatype", "language"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasLanguage: { type: "boolean" },
        conflictingDatatype: { type: "boolean" },
      },
      required: ["hasLanguage", "conflictingDatatype"],
    },
    ports: {
      inputs: [
        {
          id: "datatype",
          label: "Datatype",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "language",
          label: "Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hasLanguage",
          label: "Has Language",
          valueType: { type: "boolean" },
        },
        {
          id: "conflictingDatatype",
          label: "Conflicting Datatype",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = rdfDataTypeLanguageConflictTool.execute;
export default rdfDataTypeLanguageConflictTool;
