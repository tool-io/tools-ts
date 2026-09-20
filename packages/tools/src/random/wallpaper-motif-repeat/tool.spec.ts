import { expect, it } from "vitest";
import tool, {
  calculateWallpaperMotifRepeat,
  wallpaperMotifRepeatExample as example,
} from "./tool.js";
import { fictionCraftContractTests } from "../m250-fiction-craft-testing.js";
fictionCraftContractTests(tool, calculateWallpaperMotifRepeat, example);
it("independently audits neighbor and wrap seams and a nonorthogonal lattice", () => {
  const r = tool.execute(example.input);
  if (!r.ok) throw new Error("Expected repeat");
  for (const p of r.output.placements) {
    const next = r.output.placements.find(
        (v) => v.row === p.row && v.column === (p.column + 1) % 2,
      ),
      below = r.output.placements.find(
        (v) => v.column === p.column && v.row === (p.row + 1) % 2,
      );
    if (!next || !below) throw new Error("Missing lattice cell");
    expect(p.matrix.map((row) => row[row.length - 1])).toEqual(
      next.matrix.map((row) => row[0]),
    );
    expect(p.matrix[p.matrix.length - 1]).toEqual(below.matrix[0]);
    expect([p.x, p.y]).toEqual([
      10 + 3 * p.column + p.row,
      20 + p.column + 2 * p.row,
    ]);
  }
});
it("rejects impossible odd repeat seams, degenerate lattices and resource excess", () => {
  expect(tool.execute({ ...example.input, columns: 1 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "infeasible_repeat" }] },
  });
  expect(
    tool.execute({ ...example.input, rowVector: { x: 6, y: 2 } }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "degenerate_lattice" }] },
  });
  expect(tool.execute({ ...example.input, rows: 17 })).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_field", field: "rows" }] },
  });
});
