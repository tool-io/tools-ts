import { expect, it } from "vitest";
import tool, { example, calculateMosaicTileCutlist } from "./index.js";
import { craftSpec } from "../m500b-art-craft-spec.js";
craftSpec(tool, example, calculateMosaicTileCutlist);
it("lightweight coordinate resolution cannot produce overlapping collapsed shelves", () => {
  let draw = 0;
  expect(
    tool.execute(
      {
        width: 1e20,
        height: 1e20,
        gap: 0,
        maximumPieces: 2,
        tiles: [
          { id: "wide", width: 5e19, height: 1e20 },
          { id: "narrow", width: 1, height: 1e20 },
        ],
      },
      { random: () => (draw++ === 0 ? 0 : 0.9) },
    ),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ field: "tiles", code: "numeric_resolution" }] },
  });
});
it("lightweight uncovered area and caller tolerance", () => {
  const r = tool.execute({ ...example.input, gap: 0.5 });
  if (!r.ok) throw new Error("Expected shelf");
  expect(r.output.pieces).toHaveLength(1);
  expect(r.output.uncoveredArea).toBe(4);
  const oversized = tool.execute({
    ...example.input,
    tiles: [{ id: "large", width: 5, height: 3 }],
  });
  if (!oversized.ok) throw new Error("Expected empty cutlist");
  expect(oversized.output.pieces).toEqual([]);
  expect(oversized.output.uncoveredArea).toBe(8);
  expect(tool.execute({ ...example.input, gap: -1 })).toMatchObject({
    ok: false,
    error: { issues: [{ field: "gap", code: "invalid_field" }] },
  });
});
