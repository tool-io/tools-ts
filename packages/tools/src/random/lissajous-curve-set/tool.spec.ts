import { expect, it } from "vitest";
import tool, { example, calculateLissajousCurveSet } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateLissajousCurveSet);
it("lightweight independent quarter-phase ellipse and ordered range", () => {
  const r = tool.execute({ ...example.input, phaseTurns: [0.25] });
  if (!r.ok) throw new Error("Expected ellipse");
  expect(r.output.curves[0].points).toEqual([
    [2, 0],
    [0, 3],
    [-2, 0],
    [0, -3],
    [2, 0],
  ]);
  expect(tool.execute({ ...example.input, minimumFrequency: 2 })).toMatchObject(
    {
      ok: false,
      error: { issues: [{ field: "maximumFrequency", code: "invalid_range" }] },
    },
  );
  let n = 0;
  const { seed, ...x } = example.input;
  expect(tool.execute(x, { random: () => (++n === 2 ? 1 : 0) })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "random", code: "invalid_random_source" }] },
  });
});
