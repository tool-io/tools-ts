import { describe, expect, it } from "vitest";
import { offcutInventoryExample, runOffcutInventory } from "./tool.js";

describe("Offcut Inventory Summary", () => {
  it("publishes an executable example", () =>
    expect(runOffcutInventory(offcutInventoryExample.input)).toEqual({
      ok: true,
      output: offcutInventoryExample.output,
    }));

  it.each([
    [{ pieceLengthsMm: [500] }, { pieceCount: 1, totalLengthMm: 500 }],
    [
      { pieceLengthsMm: [800, 800, 300] },
      { pieceCount: 3, totalLengthMm: 1900 },
    ],
    [
      { pieceLengthsMm: [999999, 1] },
      { pieceCount: 2, totalLengthMm: 1000000 },
    ],
    [
      { pieceLengthsMm: [120.5, 240.5, 639] },
      { pieceCount: 3, totalLengthMm: 1000 },
    ],
    [
      { pieceLengthsMm: [2500, 1800, 950, 400] },
      { pieceCount: 4, totalLengthMm: 5650 },
    ],
  ])(
    "summarizes $pieceCount piece(s) with $totalLengthMm mm",
    (input, output) =>
      expect(runOffcutInventory(input)).toEqual({ ok: true, output }),
  );

  it("is independent of input order", () =>
    expect(runOffcutInventory({ pieceLengthsMm: [620, 1850, 1240] })).toEqual({
      ok: true,
      output: { pieceCount: 3, totalLengthMm: 3710 },
    }));

  it("returns safe integer counts", () => {
    const result = runOffcutInventory({ pieceLengthsMm: [10, 20, 30] });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(Number.isSafeInteger(result.output.pieceCount)).toBe(true);
  });

  it("rejects an empty list with empty_pieces", () => {
    const result = runOffcutInventory({ pieceLengthsMm: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_pieces");
  });

  it("rejects missing input", () => {
    expect(runOffcutInventory({}).ok).toBe(false);
  });

  it("rejects malformed entries and unknown fields", () => {
    expect(runOffcutInventory({ pieceLengthsMm: [Number.NaN] }).ok).toBe(false);
    expect(runOffcutInventory({ extra: 1, pieceLengthsMm: [100] }).ok).toBe(
      false,
    );
  });
});
