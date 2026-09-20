import {
  runImprovGenreTransition as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateImprovGenreTransition as calculate,
  improvGenreTransitionExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent alternating third genre segment", () => {
  const result = calculate({
    ...example.input,
    segmentCount: 3,
    segmentSeconds: 5,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.segments.map((s) => s.genreId)).toEqual([
    "wonder",
    "noir",
    "wonder",
  ]);
  expect(result.output.totalSeconds).toBe(15);
});
it("lightweight genre diversity and timing boundaries", () => {
  expect(
    calculate({ ...example.input, genres: [example.input.genres[0]] }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "genres", code: "infeasible_genre_transition" }],
    },
  });
  expect(calculate({ ...example.input, segmentSeconds: 0 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "segmentSeconds", code: "invalid_field" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
