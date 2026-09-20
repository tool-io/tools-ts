import { expect, it } from "vitest";
import tool, { example, calculateGeometricOpArtGrid } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateGeometricOpArtGrid);
it("lightweight displacement norm, fixed corners and preflight", () => {
  const r = tool.execute({ ...example.input, maximumDisplacement: 0.2 });
  if (!r.ok) throw new Error("Expected grid");
  expect(
    Math.hypot(r.output.points[4][0] - 1, r.output.points[4][1] - 1),
  ).toBeLessThanOrEqual(0.2);
  expect(r.output.points[8]).toEqual([2, 2]);
  expect(
    tool.execute({ ...example.input, rows: 16, columns: 16 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit_exceeded" }] },
  });
});
