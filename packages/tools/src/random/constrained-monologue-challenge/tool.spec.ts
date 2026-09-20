import {
  runConstrainedMonologueChallenge as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateConstrainedMonologueChallenge as calculate,
  constrainedMonologueChallengeExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent fixed timing and long-word wrapping", () => {
  const result = calculate({
    ...example.input,
    minimumSeconds: 12,
    maximumSeconds: 12,
    wrapWidth: 1,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.seconds).toBe(12);
  expect(result.output.brief.text.split("\n")).toContain("forest.");
  expect(result.output.requiredVocabulary).toEqual(["bell", "map"]);
});
it("lightweight vocabulary overdraw and timing boundaries", () => {
  expect(calculate({ ...example.input, requiredWords: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "count", code: "infeasible_count" }] },
  });
  expect(calculate({ ...example.input, maximumSeconds: 44 })).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "maximumSeconds", code: "invalid_duration_range" }],
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
