import {
  runNarrativeTimeOrderPuzzle as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateNarrativeTimeOrderPuzzle as calculate,
  narrativeTimeOrderPuzzleExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent negative relative times preserve chronology", () => {
  const result = calculate({
    ...example.input,
    events: [
      { id: "b", text: "Later", time: -2, predecessorIds: ["a"] },
      { id: "a", text: "Earlier", time: -8, predecessorIds: [] },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.chronology).toEqual([
    { id: "a", time: -8 },
    { id: "b", time: -2 },
  ]);
});
it("lightweight chronological dependency boundary", () => {
  expect(
    calculate({
      ...example.input,
      events: [
        { id: "a", text: "A", time: 2, predecessorIds: [] },
        { id: "b", text: "B", time: 1, predecessorIds: ["a"] },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "events", code: "chronology_conflict" }] },
  });
});
it("lightweight chronological random draw is explicitly made nonlinear", () => {
  const { seed: _seed, ...input } = example.input;
  const result = calculate(input, { random: () => 0 });
  if (!result.ok) throw new Error("success");
  expect(result.output.presentation.map((e) => e.id)).toEqual([
    "leave",
    "arrive",
  ]);
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
