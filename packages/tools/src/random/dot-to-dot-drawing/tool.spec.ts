import { expect, it } from "vitest";
import tool, {
  calculateDotToDotDrawing,
  dotToDotDrawingExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateDotToDotDrawing, example);
it("preserves jittered path order and open endpoints", () => {
  const r = tool.execute({ ...example.input, count: 24, jitterFraction: 0.9 });
  if (!r.ok) throw new Error("Expected points");
  expect(r.output.points[0]).toMatchObject({ x: 0, y: 0 });
  expect(r.output.points[23]).toMatchObject({ x: 3, y: 4 });
  for (let i = 1; i < 24; i++)
    expect(r.output.points[i].arcLength).toBeGreaterThan(
      r.output.points[i - 1].arcLength,
    );
  for (const p of r.output.points) expect(p.y === 0 || p.x === 3).toBe(true);
});
it("samples a closed square at its four vertices without repeating the first", () => {
  const r = tool.execute({
    outline: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
    closed: true,
    count: 4,
    jitterFraction: 0,
    seed: 5,
  });
  if (!r.ok) throw new Error("Expected square");
  expect(r.output.points.map((p) => [p.x, p.y])).toEqual([
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
  ]);
  expect(r.output.drawingLength).toBe(8);
});
it("rejects degenerate paths, unsupported jitter and excessive points", () => {
  expect(
    tool.execute({
      ...example.input,
      outline: [
        { x: 2, y: 3 },
        { x: 2, y: 3 },
      ],
    }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "degenerate_outline" }] },
  });
  expect(tool.execute({ ...example.input, jitterFraction: 1 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "jitterFraction" }] },
  });
  expect(tool.execute({ ...example.input, count: 257 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "count" }] },
  });
});
