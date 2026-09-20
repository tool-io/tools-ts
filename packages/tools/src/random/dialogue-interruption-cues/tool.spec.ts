import {
  runDialogueInterruptionCues as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateDialogueInterruptionCues as calculate,
  dialogueInterruptionCuesExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent exact gap endpoint and preserved turns", () => {
  const result = calculate({
    ...example.input,
    interruptionCount: 2,
    minimumGapSeconds: 3,
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.cues.map((c) => c.second)).toEqual([4, 7]);
  expect(result.output.beats.map((b) => b.id)).toEqual(["a", "b", "c"]);
});
it("lightweight impossible spacing and same-speaker exclusions", () => {
  expect(
    calculate({ ...example.input, interruptionCount: 2, minimumGapSeconds: 4 }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { field: "interruptionCount", code: "infeasible_interruptions" },
      ],
    },
  });
  expect(
    calculate({
      ...example.input,
      beats: example.input.beats.map((b) => ({ ...b, speaker: "Mara" })),
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [
        { field: "interruptionCount", code: "infeasible_interruptions" },
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
