import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly work: string;
  readonly chapter: number;
  readonly verse: number;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    work: { type: "string", maxLength: 8192 },
    chapter: { type: "integer", minimum: 1 },
    verse: { type: "integer", minimum: 1 },
  },
  required: ["work", "chapter", "verse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format supplied chapter and verse numbers without validating them against an edition or canon. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { work, chapter, verse } = request;
  const compute = (): Output => {
    H.domain(work.length > 0, "work");
    (H.domain(
      Number.isSafeInteger(chapter) &&
        chapter >= 1 &&
        chapter <= Number.MAX_SAFE_INTEGER,
      "chapter",
    ),
      chapter);
    (H.domain(
      Number.isSafeInteger(verse) &&
        verse >= 1 &&
        verse <= Number.MAX_SAFE_INTEGER,
      "verse",
    ),
      verse);
    return { reference: work + " " + chapter + ":" + verse };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { work: "Book A", chapter: 3, verse: 16 },
  output: { reference: "Book A 3:16" },
} satisfies ToolExample<Input, Output>;
export const verseReferenceChapterVerseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/verse-reference-chapter-verse-token",
    title: "Verse Reference Chapter Verse Token Tool",
    description:
      "Format supplied chapter and verse numbers without validating them against an edition or canon.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        work: { type: "string", maxLength: 8192 },
        chapter: { type: "integer", minimum: 1 },
        verse: { type: "integer", minimum: 1 },
      },
      required: ["work", "chapter", "verse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    ports: {
      inputs: [
        {
          id: "work",
          label: "Work",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chapter",
          label: "Chapter",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "verse",
          label: "Verse",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = verseReferenceChapterVerseTokenTool.execute;
export default verseReferenceChapterVerseTokenTool;
