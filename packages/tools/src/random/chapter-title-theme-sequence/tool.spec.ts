import {
  runChapterTitleThemeSequence as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateChapterTitleThemeSequence as calculate,
  chapterTitleThemeSequenceExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent two-motif recurrence has exact gap two", () => {
  const result = calculate({
    ...example.input,
    motifs: [
      example.input.motifs[0],
      { id: "stone", label: "Stone", vocabulary: ["Still"] },
    ],
    chapterCount: 4,
    recurrenceEvery: 2,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.chapters.map((c) => c.motifId)).toEqual([
    "stone",
    "tide",
    "stone",
    "tide",
  ]);
  expect(result.output.recurrence.map((r) => r.chapters)).toEqual([
    [2, 4],
    [1, 3],
  ]);
});
it("lightweight recurrence policy boundary", () => {
  expect(calculate({ ...example.input, recurrenceEvery: 2 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "recurrenceEvery", code: "incompatible_recurrence" }],
    },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
