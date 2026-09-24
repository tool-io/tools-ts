import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edition: string;
  readonly language: string;
  readonly sourceNamespace: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edition: { type: "string", maxLength: 8192 },
    language: { type: "string", maxLength: 8192 },
    sourceNamespace: { type: "string", maxLength: 8192 },
  },
  required: ["edition", "language", "sourceNamespace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Build an exact supplied public leaflet edition/language identity without validating medical content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edition, language, sourceNamespace } = request;
  const compute = (): Output => {
    H.domain(
      edition.length > 0 && language.length > 0 && sourceNamespace.length > 0,
    );
    return { key: JSON.stringify([sourceNamespace, edition, language]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edition: "v2", language: "en", sourceNamespace: "sourceA" },
  output: { key: '["sourceA","v2","en"]' },
} satisfies ToolExample<Input, Output>;
export const leafletEditionLanguageTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/leaflet-edition-language-token",
    title: "Leaflet Edition Language Token Tool",
    description:
      "Build an exact supplied public leaflet edition/language identity without validating medical content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edition: { type: "string", maxLength: 8192 },
        language: { type: "string", maxLength: 8192 },
        sourceNamespace: { type: "string", maxLength: 8192 },
      },
      required: ["edition", "language", "sourceNamespace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "language",
          label: "Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceNamespace",
          label: "Source Namespace",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = leafletEditionLanguageTokenTool.execute;
export default leafletEditionLanguageTokenTool;
