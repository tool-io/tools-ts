import { expect, it } from "vitest";
import tool, { example, calculateRadialRosettePattern } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateRadialRosettePattern);
it("lightweight opposite points and jitter/resource boundaries", () => {
  const r = tool.execute({ radii: [3], order: 2, jitter: 1, seed: 42 });
  if (!r.ok) throw new Error("Expected rosette");
  expect(r.output.points[1]).toEqual([-r.output.points[0][0], 0]);
  expect(tool.execute({ ...example.input, jitter: 2 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "jitter", code: "invalid_jitter" }] },
  });
  expect(
    tool.execute({ ...example.input, radii: Array(16).fill(2), order: 16 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit_exceeded" }] },
  });
});
