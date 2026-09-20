import {
  runNarrativeLocationTransition as runFromIndex,
  example as exampleFromIndex,
} from "./index.js";
import { expect, it } from "vitest";
import index from "./index.js";
import tool, {
  calculateNarrativeLocationTransition as calculate,
  narrativeLocationTransitionExample as example,
} from "./tool.js";
import { narrativeContract } from "../m500b-narrative-spec-support.js";
narrativeContract(tool, example, calculate, index);
it("lightweight independent explicit waiting and inclusive finish", () => {
  const result = calculate({
    ...example.input,
    settings: [
      example.input.settings[0],
      { ...example.input.settings[1], opens: 10, closes: 14 },
    ],
  });
  if (!result.ok) throw new Error("success");
  expect(result.output.itinerary[1]).toMatchObject({
    arrivalSecond: 7,
    startSecond: 10,
    endSecond: 14,
  });
});
it("lightweight distinguishes infeasibility from malformed windows", () => {
  expect(calculate({ ...example.input, transitions: [] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "transitions", code: "infeasible_itinerary" }] },
  });
  expect(
    calculate({
      ...example.input,
      settings: [{ id: "dock", text: "Dock", opens: 4, closes: 3 }],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "settings", code: "invalid_time_window" }] },
  });
});
it("lightweight named index runner and canonical export", () => {
  expect(exampleFromIndex).toEqual(example);
  expect(runFromIndex(exampleFromIndex.input)).toEqual({
    ok: true,
    output: exampleFromIndex.output,
  });
});
