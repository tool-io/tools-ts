import {
  runStoryOpeningClosingPair as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateStoryOpeningClosingPair as calculate,
  storyOpeningClosingPairExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight discloses ambiguous compatibility independently", () => {
  const result = calculate({
    ...example.input,
    endings: [
      ...example.input.endings,
      { id: "stay", text: "She stayed.", tags: ["home"] },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.compatible.map((e) => e.endingId)).toEqual([
    "return",
    "stay",
  ]);
  expect(result.output.choices).toHaveLength(2);
});
it("lightweight rejects absent tags and excess distractors", () => {
  expect(calculate({ ...example.input, distractorCount: 2 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "openings", code: "infeasible_pair" }] },
  });
  expect(
    calculate({
      ...example.input,
      openings: [{ id: "door\n", text: "x", tags: [] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "openings", code: "invalid_field" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
