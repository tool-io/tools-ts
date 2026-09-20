import { expect, it } from "vitest";
import tool, {
  calculateStainedGlassPanelLayout,
  stainedGlassPanelLayoutExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateStainedGlassPanelLayout, example);
it("independently checks positive-area conservation and pairwise nonoverlap", () => {
  const r = tool.execute({ ...example.input, cellCount: 20 });
  if (!r.ok) throw new Error("Expected partition");
  expect(r.output.cells.reduce((s, c) => s + c.area, 0)).toBeCloseTo(24, 12);
  for (const a of r.output.cells)
    for (const b of r.output.cells)
      if (a.id < b.id) {
        const overlapX =
          Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        const overlapY =
          Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        expect(Math.min(overlapX, overlapY)).toBeLessThanOrEqual(
          Number.EPSILON * 8,
        );
      }
});
it("rejects numeric overflow, underflow, invalid palette and resource excess", () => {
  expect(
    tool.execute({ ...example.input, width: 1e308, height: 1e308 }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "numeric_overflow" }] },
  });
  expect(
    tool.execute({
      ...example.input,
      width: Number.MIN_VALUE,
      height: Number.MIN_VALUE,
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "numeric_resolution" }] },
  });
  expect(tool.execute({ ...example.input, cellCount: 65 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "cellCount" }] },
  });
});
