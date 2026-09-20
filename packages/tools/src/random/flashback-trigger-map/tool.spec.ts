import {
  runFlashbackTriggerMap as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateFlashbackTriggerMap as calculate,
  flashbackTriggerMapExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent alternative past triggers remain disclosed", () => {
  const result = calculate({
    ...example.input,
    pastEvents: [
      ...example.input.pastEvents,
      { id: "echo", text: "Echo", time: 8, tags: ["sound"] },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.links[0].compatibleEventIds).toEqual([
    "arrival",
    "echo",
  ]);
});
it("lightweight strict chronological endpoint excludes simultaneous event", () => {
  expect(
    calculate({
      ...example.input,
      pastEvents: [
        { ...example.input.pastEvents[0], time: 10 },
        example.input.pastEvents[1],
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: {
      issues: [{ field: "presentScenes", code: "infeasible_flashback" }],
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
