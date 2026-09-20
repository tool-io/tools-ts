import {
  runCharacterExitEntryCues as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateCharacterExitEntryCues as calculate,
  characterExitEntryCuesExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent role doubling is allowed across separate scenes", () => {
  const result = calculate({
    ...example.input,
    cast: example.input.cast.map((c) => ({ ...c, performerId: "a" })),
  });
  if (!result.ok) throw new Error("success");
  expect(
    result.output.scenes[1].cues.map((c) => [c.kind, c.performerId]),
  ).toEqual([
    ["exit", "a"],
    ["enter", "a"],
  ]);
});
it("lightweight simultaneous role and cue resource bounds", () => {
  expect(
    calculate({
      ...example.input,
      cast: example.input.cast.map((c) => ({ ...c, performerId: "a" })),
      scenes: [{ id: "x", requiredRoleIds: ["m", "i"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "scenes", code: "simultaneous_role_conflict" }],
    },
  });
  expect(
    calculate({
      ...example.input,
      scenes: [{ id: "x", requiredRoleIds: ["m", "i"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { field: "maximumSimultaneousPerformers", code: "infeasible_capacity" },
      ],
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
