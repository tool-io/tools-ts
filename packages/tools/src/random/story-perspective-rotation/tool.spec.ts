import {
  runStoryPerspectiveRotation as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateStoryPerspectiveRotation as calculate,
  storyPerspectiveRotationExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent unrestricted quotas still conserve appearances", () => {
  const result = calculate({
    ...example.input,
    chapters: example.input.chapters.map((c) => ({ ...c, requiredTags: [] })),
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.chapters.map((c) => c.viewpointId).sort()).toEqual([
    "i",
    "m",
  ]);
  expect(result.output.finalQuotas.map((q) => q.remaining)).toEqual([0, 0]);
});
it("lightweight quota mismatch and knowledge impossibility", () => {
  expect(
    calculate({
      ...example.input,
      viewpoints: [{ id: "m", quota: 1, knownTags: [] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "viewpoints.quota", code: "quota_mismatch" }] },
  });
  expect(
    calculate({
      ...example.input,
      chapters: [
        { id: "x", requiredTags: ["absent"] },
        { id: "y", requiredTags: [] },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "chapters", code: "infeasible_perspectives" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
