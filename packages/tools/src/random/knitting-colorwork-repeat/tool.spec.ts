import { expect, it } from "vitest";
import tool, { example, calculateKnittingColorworkRepeat } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateKnittingColorworkRepeat);
it("lightweight odd cyclic alternation is impossible, relaxed float fits", () => {
  expect(tool.execute({ ...example.input, columns: 3 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "maximumFloat", code: "infeasible_chart" }] },
  });
  const r = tool.execute({ ...example.input, columns: 3, maximumFloat: 2 });
  if (!r.ok) throw new Error("Expected repeat");
  expect(r.output.longestCircularFloatByRow).toEqual([2]);
  expect(r.output.chart[0]).toHaveLength(3);
});
