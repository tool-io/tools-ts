import { expect, it } from "vitest";
import tool, { example, calculateWeavingColorThreadPlan } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateWeavingColorThreadPlan);
it("lightweight caller lift controls visibility and exact axis shape", () => {
  const r = tool.execute({
    ...example.input,
    lift: [
      [1, 1],
      [1, 1],
    ],
  });
  if (!r.ok) throw new Error("Expected chart");
  expect(r.output.visibleChart).toEqual([
    [0, 0],
    [0, 0],
  ]);
  expect(r.output.visibleCounts).toEqual([
    { id: "red", count: 4 },
    { id: "blue", count: 0 },
  ]);
  expect(tool.execute({ ...example.input, lift: [[1, 0]] })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "lift", code: "invalid_lift_shape" }] },
  });
});
