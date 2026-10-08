import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noteId: string;
  readonly spanLocator: string;
  readonly suppliedLanguageTag: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noteId: { type: "string", maxLength: 8192, minLength: 1 },
    spanLocator: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedLanguageTag: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["noteId", "spanLocator", "suppliedLanguageTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit field-note language-switch span and supplied language tag without detecting language. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noteId, spanLocator, suppliedLanguageTag } = request;
  const compute = (): Output => {
    H.domain(noteId.length > 0, "noteId");
    H.domain(spanLocator.length > 0, "spanLocator");
    H.domain(suppliedLanguageTag.length > 0, "suppliedLanguageTag");
    return {
      token: JSON.stringify([noteId, spanLocator, suppliedLanguageTag]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noteId: "N17", spanLocator: "lines 4-6", suppliedLanguageTag: "es" },
  output: { token: '["N17","lines 4-6","es"]' },
} satisfies ToolExample<Input, Output>;
export const fieldNoteLanguageSwitchSpanLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/field-note-language-switch-span-label",
    title: "Field Note Language Switch Span Label Tool",
    description:
      "Preserve an explicit field-note language-switch span and supplied language tag without detecting language.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noteId: { type: "string", maxLength: 8192, minLength: 1 },
        spanLocator: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedLanguageTag: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["noteId", "spanLocator", "suppliedLanguageTag"],
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
          id: "noteId",
          label: "Note Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "spanLocator",
          label: "Span Locator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedLanguageTag",
          label: "Supplied Language Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldNoteLanguageSwitchSpanLabelTool.execute;
export default fieldNoteLanguageSwitchSpanLabelTool;
