import {
  runMicrofictionWordBudget as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateMicrofictionWordBudget as calculate,
  microfictionWordBudgetExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent tight exact-token budget", () => {
  const result = calculate({
    ...example.input,
    minimumWords: 2,
    maximumWords: 2,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.requiredWords.join(" ").split(/\s/u)).toHaveLength(2);
  expect(result.output.wordBudget.maximum).toBe(2);
});
it("lightweight token endings and budget feasibility", () => {
  expect(calculate({ ...example.input, words: ["map\n"] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "words", code: "invalid_word" }] },
  });
  expect(
    calculate({ ...example.input, minimumWords: 1, maximumWords: 1 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "requiredCount", code: "infeasible_word_budget" }],
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
