import { expect, it } from "vitest";
import tool, { example, calculateRecursiveCircleNesting } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateRecursiveCircleNesting);
it("lightweight independent containment and ratio boundary", () => {
  const r = tool.execute({ ...example.input, depth: 2, childRatio: 0.5 });
  if (!r.ok) throw new Error("Expected circles");
  expect(r.output.circles).toHaveLength(7);
  for (const c of r.output.circles.slice(1)) {
    const p = r.output.circles[c.parent];
    expect(
      Math.hypot(c.center[0] - p.center[0], c.center[1] - p.center[1]) +
        c.radius,
    ).toBeLessThanOrEqual(p.radius);
  }
  expect(tool.execute({ ...example.input, childRatio: 0.6 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "childRatio", code: "invalid_field" }] },
  });
});
