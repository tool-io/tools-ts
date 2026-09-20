import {
  runCharacterObjectiveConflict as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateCharacterObjectiveConflict as calculate,
  characterObjectiveConflictExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent compatible objectives have a zero matrix", () => {
  const result = calculate({ ...example.input, incompatibilities: [] });
  if (!result.ok) throw new Error("success");
  expect(result.output.matrix).toEqual([
    [false, false],
    [false, false],
  ]);
  expect(result.output.conflicts).toEqual([]);
});
it("lightweight conflict references and reversed duplicates", () => {
  expect(
    calculate({
      ...example.input,
      incompatibilities: [
        { left: "keep", right: "absent", tags: [], resolution: "Wait" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "incompatibilities", code: "invalid_reference" }],
    },
  });
  expect(
    calculate({
      ...example.input,
      incompatibilities: [
        ...example.input.incompatibilities,
        { left: "share", right: "keep", tags: [], resolution: "Wait" },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "incompatibilities", code: "duplicate_entries" }],
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
