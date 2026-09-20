import {
  runDanceMotifPermutation as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateDanceMotifPermutation as calculate,
  danceMotifPermutationExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent eight-count boundary with fractional audio rate", () => {
  const result = calculate({
    ...example.input,
    motifs: [
      { id: "a", counts: 8, startTag: "closed", endTag: "open" },
      { id: "b", counts: 2, startTag: "open", endTag: "closed" },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.motifs[1]).toEqual({
    id: "b",
    startCount: 8,
    endCount: 10,
    phraseNumber: 2,
    oneBasedCount: 1,
    audioBeatIndex: 6,
  });
});
it("lightweight endpoint and inherited mapper limits", () => {
  expect(
    calculate({ ...example.input, requiredEndTag: "absent" }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "motifs", code: "infeasible_motif_order" }] },
  });
  expect(
    calculate({
      ...example.input,
      motifs: [
        { id: "a", counts: 1000001, startTag: "closed", endTag: "open" },
        { id: "b", counts: 1, startTag: "open", endTag: "closed" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "motifs.counts", code: "core_count_limit" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
