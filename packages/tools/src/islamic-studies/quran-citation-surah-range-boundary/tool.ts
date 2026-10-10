import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surahLabel: string;
  readonly firstVerse: number;
  readonly lastVerse: number;
  readonly suppliedVerseCount: number;
};
export type Output = {
  readonly citationKey: string;
  readonly selectedVerseCount: number;
  readonly withinSuppliedCount: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surahLabel: { type: "string", maxLength: 8192, minLength: 1 },
    firstVerse: { type: "integer", minimum: 1 },
    lastVerse: { type: "integer" },
    suppliedVerseCount: { type: "integer", minimum: 1 },
  },
  required: ["surahLabel", "firstVerse", "lastVerse", "suppliedVerseCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citationKey: { type: "string", maxLength: 8192 },
    selectedVerseCount: { type: "integer" },
    withinSuppliedCount: { type: "boolean" },
  },
  required: ["citationKey", "selectedVerseCount", "withinSuppliedCount"],
} as const;
/** Check an explicit inclusive Quran verse range against a caller-supplied surah verse count without choosing a numbering tradition or lookup table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surahLabel, firstVerse, lastVerse, suppliedVerseCount } = request;
  const compute = (): Output => {
    H.domain(surahLabel.length > 0, "surahLabel");
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
    (H.domain(
      Number.isSafeInteger(suppliedVerseCount) &&
        suppliedVerseCount >= 1 &&
        suppliedVerseCount <= Number.MAX_SAFE_INTEGER,
      "suppliedVerseCount",
    ),
      suppliedVerseCount);
    return {
      citationKey: JSON.stringify([surahLabel, firstVerse, lastVerse]),
      selectedVerseCount: lastVerse - firstVerse + 1,
      withinSuppliedCount: lastVerse <= suppliedVerseCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surahLabel: "1",
    firstVerse: 1,
    lastVerse: 3,
    suppliedVerseCount: 7,
  },
  output: {
    citationKey: '["1",1,3]',
    selectedVerseCount: 3,
    withinSuppliedCount: true,
  },
} satisfies ToolExample<Input, Output>;
export const quranCitationSurahRangeBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/quran-citation-surah-range-boundary",
    title: "Quran Citation Surah Range Boundary Tool",
    description:
      "Check an explicit inclusive Quran verse range against a caller-supplied surah verse count without choosing a numbering tradition or lookup table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surahLabel: { type: "string", maxLength: 8192, minLength: 1 },
        firstVerse: { type: "integer", minimum: 1 },
        lastVerse: { type: "integer" },
        suppliedVerseCount: { type: "integer", minimum: 1 },
      },
      required: ["surahLabel", "firstVerse", "lastVerse", "suppliedVerseCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citationKey: { type: "string", maxLength: 8192 },
        selectedVerseCount: { type: "integer" },
        withinSuppliedCount: { type: "boolean" },
      },
      required: ["citationKey", "selectedVerseCount", "withinSuppliedCount"],
    },
    ports: {
      inputs: [
        {
          id: "surahLabel",
          label: "Surah Label",
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
        {
          id: "suppliedVerseCount",
          label: "Supplied Verse Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "citationKey",
          label: "Citation Key",
          valueType: { type: "string" },
        },
        {
          id: "selectedVerseCount",
          label: "Selected Verse Count",
          valueType: { type: "integer" },
        },
        {
          id: "withinSuppliedCount",
          label: "Within Supplied Count",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quranCitationSurahRangeBoundaryTool.execute;
export default quranCitationSurahRangeBoundaryTool;
