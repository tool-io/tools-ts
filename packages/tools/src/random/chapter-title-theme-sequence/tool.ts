import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nStringList,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nSample,
  nDistinct,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type ChapterTitleThemeSequenceInput = NSeed & {
  readonly motifs: readonly {
    readonly id: string;
    readonly label: string;
    readonly vocabulary: readonly string[];
  }[];
  readonly chapterCount: number;
  readonly recurrenceEvery: number;
  readonly wrapWidth: number;
};
export type ChapterTitleThemeSequenceOutput = NReplay & {
  readonly cycle: readonly string[];
  readonly chapters: readonly {
    readonly chapter: number;
    readonly motifId: string;
    readonly word: string;
    readonly title: NWrapped;
  }[];
  readonly recurrence: readonly {
    readonly motifId: string;
    readonly chapters: readonly number[];
  }[];
};
export const inputSchema = nInput({
  motifs: nArray(
    nObject({ id: nId, label: nText, vocabulary: nStringList }),
    8,
    1,
  ),
  chapterCount: nInt(1, 32),
  recurrenceEvery: nInt(1, 8),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  cycle: nArray(nId, 8, 1),
  chapters: nArray(
    nObject({
      chapter: nInt(1, 32),
      motifId: nId,
      word: nText,
      title: nWrapped,
    }),
    32,
    1,
  ),
  recurrence: nArray(
    nObject({ motifId: nId, chapters: nArray(nInt(1, 32), 32) }),
    8,
    1,
  ),
});
const isInput = (v: unknown): v is ChapterTitleThemeSequenceInput =>
  matchesModelInput(v, inputSchema);
export const calculateChapterTitleThemeSequence = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ChapterTitleThemeSequenceOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.motifs.map((m) => m.id),
      "motifs",
    );
    for (const m of x.motifs) nDistinct(m.vocabulary, "motifs.vocabulary");
    if (x.recurrenceEvery !== x.motifs.length)
      return simpleError(
        "recurrenceEvery",
        "This complete motif-cycle policy requires one chapter slot per motif.",
        "incompatible_recurrence",
      );
    const cycle = nSample(x.motifs, x.motifs.length, r),
      chapters = Array.from({ length: x.chapterCount }, (_, i) => {
        const motif = cycle[i % cycle.length];
        if (!motif) throw new Error("missing motif");
        const word = nPick(motif.vocabulary, r);
        return {
          chapter: i + 1,
          motifId: motif.id,
          word,
          title: nWrap(`${word} ${motif.label}`, x.wrapWidth),
        };
      });
    return {
      cycle: cycle.map((m) => m.id),
      chapters,
      recurrence: x.motifs.map((m) => ({
        motifId: m.id,
        chapters: chapters
          .filter((c) => c.motifId === m.id)
          .map((c) => c.chapter),
      })),
    };
  });
export const chapterTitleThemeSequenceExample = {
  input: {
    motifs: [{ id: "tide", label: "Tide", vocabulary: ["Rise", "Fall"] }],
    chapterCount: 3,
    recurrenceEvery: 1,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    cycle: ["tide"],
    chapters: [
      {
        chapter: 1,
        motifId: "tide",
        word: "Rise",
        title: { text: "Rise Tide", lineCount: 1 },
      },
      {
        chapter: 2,
        motifId: "tide",
        word: "Fall",
        title: { text: "Fall Tide", lineCount: 1 },
      },
      {
        chapter: 3,
        motifId: "tide",
        word: "Fall",
        title: { text: "Fall Tide", lineCount: 1 },
      },
    ],
    recurrence: [{ motifId: "tide", chapters: [1, 2, 3] }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ChapterTitleThemeSequenceInput,
  ChapterTitleThemeSequenceOutput
>;
export const chapterTitleThemeSequenceTool = createModelDefinition<
  ChapterTitleThemeSequenceInput,
  ChapterTitleThemeSequenceOutput
>({
  id: "random/chapter-title-theme-sequence",
  title: "Random Chapter Title Theme Sequence Generator",
  description:
    "Compose supplied motif vocabulary into chapter headings using a randomized complete cycle with exact motif recurrence; typography remains app-owned.",
  inputSchema,
  outputSchema,
  execute: calculateChapterTitleThemeSequence,
});
export const runChapterTitleThemeSequence =
  chapterTitleThemeSequenceTool.execute;
export default chapterTitleThemeSequenceTool;
