import {
  runEnsemblePromptRelay as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateEnsemblePromptRelay as calculate,
  ensemblePromptRelayExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent third turn wraps participant cycle and caps fragments", () => {
  const result = calculate({
    ...example.input,
    turns: 3,
    maximumFragmentAppearances: 2,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.turns.map((t) => t.participantId)).toEqual([
    "b",
    "a",
    "b",
  ]);
  expect(result.output.fragmentUsage.reduce((s, f) => s + f.count, 0)).toBe(3);
  expect(result.output.turns[2].handoffTo).toBeNull();
});
it("lightweight appearance cap and participant identity errors", () => {
  expect(calculate({ ...example.input, turns: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "turns", code: "infeasible_relay" }] },
  });
  expect(
    calculate({ ...example.input, participants: ["a", "a"] }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "participants", code: "duplicate_entries" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
