import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly translatedText: string;
  readonly noteId: string;
};
export type Output = { readonly markedText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    translatedText: { type: "string", maxLength: 8192 },
    noteId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["translatedText", "noteId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { markedText: { type: "string", maxLength: 8192 } },
  required: ["markedText"],
} as const;
/** Append an explicit square-bracket footnote identifier to supplied translated text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { translatedText, noteId } = request;
  const compute = (): Output => {
    H.domain(noteId.length > 0, "noteId");
    return { markedText: translatedText + "[" + noteId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { translatedText: "A river", noteId: "17" },
  output: { markedText: "A river[17]" },
} satisfies ToolExample<Input, Output>;
export const translationFootnoteInlineMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/translation-footnote-inline-marker",
    title: "Translation Footnote Inline Marker",
    description:
      "Append an explicit square-bracket footnote identifier to supplied translated text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        translatedText: { type: "string", maxLength: 8192 },
        noteId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["translatedText", "noteId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { markedText: { type: "string", maxLength: 8192 } },
      required: ["markedText"],
    },
    ports: {
      inputs: [
        {
          id: "translatedText",
          label: "Translated Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "noteId",
          label: "Note Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "markedText",
          label: "Marked Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = translationFootnoteInlineMarkerTool.execute;
export default translationFootnoteInlineMarkerTool;
