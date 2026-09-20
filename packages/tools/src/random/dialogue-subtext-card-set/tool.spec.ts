import {
  runDialogueSubtextCardSet as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateDialogueSubtextCardSet as calculate,
  dialogueSubtextCardSetExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent disjoint contexts exclude irrelevant interpretation", () => {
  const result = calculate({
    ...example.input,
    intentions: [
      ...example.input.intentions,
      { id: "escape", text: "Leave", tags: ["flight"] },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.cards[0].compatibleIntentionIds).toEqual([
    "help",
    "protect",
  ]);
});
it("lightweight absent and duplicate context diagnostics", () => {
  expect(
    calculate({
      ...example.input,
      intentions: [{ id: "x", text: "Leave", tags: ["flight"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "intentions", code: "infeasible_context" }] },
  });
  expect(
    calculate({
      ...example.input,
      utterances: [{ id: "x", text: "Stay", tags: ["trust", "trust"] }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "tags", code: "duplicate_entries" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
