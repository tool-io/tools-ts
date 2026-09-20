import { expect, it } from "vitest";
import tool, { example, calculateGeometricHatchingPatchwork } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateGeometricHatchingPatchwork);
it("lightweight boundary clipping and tiny-spacing budget", () => {
  const r = tool.execute({ ...example.input, angles: [0.25] });
  if (!r.ok) throw new Error("Expected hatches");
  for (const p of r.output.patches)
    for (const s of p.lines)
      for (const [a, b] of [s.from, s.to]) {
        expect(a >= p.rect.x && a <= p.rect.x + p.rect.width).toBe(true);
        expect(b >= 0 && b <= 2).toBe(true);
      }
  expect(tool.execute({ ...example.input, spacings: [0.001] })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "resource_limit_exceeded" }] },
  });
});
