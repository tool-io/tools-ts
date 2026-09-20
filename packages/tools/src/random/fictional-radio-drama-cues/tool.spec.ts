import {
  runFictionalRadioDramaCues as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateFictionalRadioDramaCues as calculate,
  fictionalRadioDramaCuesExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent exact end-fit and simultaneous dialogue ordering", () => {
  const result = calculate({
    ...example.input,
    sounds: [{ ...example.input.sounds[0], offsetSeconds: 2 }],
  });
  if (!result.ok) throw new Error("success");
  expect(
    result.output.rundown.map((c) => [c.id, c.startSecond, c.endSecond]),
  ).toEqual([
    ["a", 0, 4],
    ["bell", 2, 4],
    ["b", 4, 7],
  ]);
});
it("lightweight overflow fit and unknown beat diagnostics", () => {
  expect(
    calculate({
      ...example.input,
      sounds: [{ ...example.input.sounds[0], offsetSeconds: 3 }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "sounds", code: "infeasible_sound_cue" }] },
  });
  expect(
    calculate({
      ...example.input,
      sounds: [{ ...example.input.sounds[0], eligibleBeatIds: ["missing"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "sounds.eligibleBeatIds", code: "invalid_reference" }],
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
