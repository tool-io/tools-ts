import {
  runImprovDialogueWordBan as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateImprovDialogueWordBan as calculate,
  improvDialogueWordBanExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent backtracking avoids a banned substitute token", () => {
  const result = calculate({
    ...example.input,
    substitutes: [{ id: "x", objective: "no", tags: ["request"] }],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.bannedWords).toEqual(["yes"]);
  expect(result.output.cards[0].substituteObjective).toBe("no");
});
it("lightweight complete ban infeasibility and token endings", () => {
  expect(
    calculate({
      ...example.input,
      banCount: 2,
      substitutes: [{ id: "x", objective: "yes no", tags: ["request"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "substitutes", code: "infeasible_word_bans" }] },
  });
  expect(
    calculate({ ...example.input, forbiddenWords: ["no\n"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "forbiddenWords", code: "invalid_word" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
