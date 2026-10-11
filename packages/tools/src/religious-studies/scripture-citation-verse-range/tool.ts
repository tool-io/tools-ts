import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly chapterText: string;
  readonly firstVerse: number;
  readonly lastVerse: number;
};
export type Output = {
  readonly verseCount: number;
  readonly citationToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    chapterText: { type: "string", maxLength: 8192, minLength: 1 },
    firstVerse: { type: "integer", minimum: 1 },
    lastVerse: { type: "integer" },
  },
  required: ["workId", "chapterText", "firstVerse", "lastVerse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verseCount: { type: "integer" },
    citationToken: { type: "string", maxLength: 8192 },
  },
  required: ["verseCount", "citationToken"],
} as const;
/** Build an explicit inclusive verse-range citation without resolving a canon, edition, or verse text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, chapterText, firstVerse, lastVerse } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0 && chapterText.length > 0, "workId");
    (H.domain(
      Number.isSafeInteger(firstVerse) &&
        firstVerse >= 1 &&
        firstVerse <= Number.MAX_SAFE_INTEGER,
      "firstVerse",
    ),
      firstVerse);
    (H.domain(
      Number.isSafeInteger(lastVerse) &&
        lastVerse >= firstVerse &&
        lastVerse <= Number.MAX_SAFE_INTEGER,
      "lastVerse",
    ),
      lastVerse);
    return {
      verseCount: lastVerse - firstVerse + 1,
      citationToken: JSON.stringify([
        workId,
        chapterText,
        firstVerse,
        lastVerse,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workId: "WORK17", chapterText: "3", firstVerse: 4, lastVerse: 8 },
  output: { verseCount: 5, citationToken: '["WORK17","3",4,8]' },
} satisfies ToolExample<Input, Output>;
export const scriptureCitationVerseRangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["religious-studies", "religious studies", "humanities"],
      keywords: ["religious studies", "humanities"],
    },
    id: "religious-studies/scripture-citation-verse-range",
    title: "Scripture Citation Verse Range",
    description:
      "Build an explicit inclusive verse-range citation without resolving a canon, edition, or verse text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workId: { type: "string", maxLength: 8192, minLength: 1 },
        chapterText: { type: "string", maxLength: 8192, minLength: 1 },
        firstVerse: { type: "integer", minimum: 1 },
        lastVerse: { type: "integer" },
      },
      required: ["workId", "chapterText", "firstVerse", "lastVerse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verseCount: { type: "integer" },
        citationToken: { type: "string", maxLength: 8192 },
      },
      required: ["verseCount", "citationToken"],
    },
    ports: {
      inputs: [
        {
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chapterText",
          label: "Chapter Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstVerse",
          label: "First Verse",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastVerse",
          label: "Last Verse",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "verseCount",
          label: "Verse Count",
          valueType: { type: "integer" },
        },
        {
          id: "citationToken",
          label: "Citation Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = scriptureCitationVerseRangeTool.execute;
export default scriptureCitationVerseRangeTool;
