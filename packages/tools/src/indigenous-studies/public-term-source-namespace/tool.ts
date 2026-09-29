import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly source: string;
  readonly languageLabel: string;
};
export type Output = { readonly qualifiedKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    languageLabel: { type: "string", maxLength: 8192 },
  },
  required: ["term", "source", "languageLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedKey: { type: "string", maxLength: 8192 } },
  required: ["qualifiedKey"],
} as const;
/** Qualify a supplied public term by source/language metadata without authenticating language, meaning or access permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, source, languageLabel } = request;
  const compute = (): Output => {
    return { qualifiedKey: JSON.stringify([source, languageLabel, term]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    term: "term-A",
    source: "public-source-2",
    languageLabel: "supplied-language",
  },
  output: { qualifiedKey: '["public-source-2","supplied-language","term-A"]' },
} satisfies ToolExample<Input, Output>;
export const publicTermSourceNamespaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "indigenous-studies/public-term-source-namespace",
    title: "Public Term Source Namespace Tool",
    description:
      "Qualify a supplied public term by source/language metadata without authenticating language, meaning or access permission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        languageLabel: { type: "string", maxLength: 8192 },
      },
      required: ["term", "source", "languageLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifiedKey: { type: "string", maxLength: 8192 } },
      required: ["qualifiedKey"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageLabel",
          label: "Language Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "qualifiedKey",
          label: "Qualified Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicTermSourceNamespaceTool.execute;
export default publicTermSourceNamespaceTool;
