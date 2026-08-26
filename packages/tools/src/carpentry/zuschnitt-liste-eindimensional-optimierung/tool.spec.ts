import { describe, expect, it } from "vitest";
import { cutList1dExample, runCutList1d } from "./tool.js";

describe("1D Cut List Optimizer", () => {
  it("publishes an executable example", () =>
    expect(runCutList1d(cutList1dExample.input)).toEqual({
      ok: true,
      output: cutList1dExample.output,
    }));

  it.each([
    [
      { pieceLengthsMm: [1200, 1200], stockLengthMm: 2400 },
      { barsUsed: 1, totalWasteMm: 0 },
    ],
    [
      { pieceLengthsMm: [500], stockLengthMm: 1000 },
      { barsUsed: 1, totalWasteMm: 500 },
    ],
    [
      { pieceLengthsMm: [400, 700, 300], stockLengthMm: 1000 },
      { barsUsed: 2, totalWasteMm: 600 },
    ],
    [
      { pieceLengthsMm: [3, 3, 2, 2, 2], stockLengthMm: 10 },
      { barsUsed: 2, totalWasteMm: 8 },
    ],
    [
      { pieceLengthsMm: [2400], stockLengthMm: 2400 },
      { barsUsed: 1, totalWasteMm: 0 },
    ],
    [
      { pieceLengthsMm: [100, 200, 300], stockLengthMm: 1000 },
      { barsUsed: 1, totalWasteMm: 400 },
    ],
  ])("optimizes $pieceLengthsMm into $barsUsed bar(s)", (input, output) =>
    expect(runCutList1d(input)).toEqual({ ok: true, output }),
  );

  it("is independent of input order", () =>
    expect(
      runCutList1d({ stockLengthMm: 1000, pieceLengthsMm: [300, 700, 400] }),
    ).toEqual({ ok: true, output: { barsUsed: 2, totalWasteMm: 600 } }));

  it("rejects an empty piece list with empty_pieces", () => {
    const result = runCutList1d({ stockLengthMm: 2400, pieceLengthsMm: [] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_pieces");
  });

  it("rejects a piece longer than stock with piece_too_long", () => {
    const result = runCutList1d({
      stockLengthMm: 2000,
      pieceLengthsMm: [2001],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.issues[0]?.code).toBe("piece_too_long");
      expect(result.error.issues[0]?.field).toBe("pieceLengthsMm");
    }
  });

  it("rejects non-positive piece lengths", () => {
    const result = runCutList1d({ stockLengthMm: 2400, pieceLengthsMm: [0] });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_piece_length");
  });

  it("rejects a non-positive stock length with invalid_stock_length", () => {
    const result = runCutList1d({ stockLengthMm: 0, pieceLengthsMm: [500] });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_stock_length");
  });

  it("rejects missing inputs", () => {
    expect(runCutList1d({ pieceLengthsMm: [500] }).ok).toBe(false);
    expect(runCutList1d({ stockLengthMm: 2400 }).ok).toBe(false);
  });

  it("rejects malformed input values", () => {
    expect(
      runCutList1d({
        pieceLengthsMm: [500, Number.NaN],
        stockLengthMm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
    expect(
      runCutList1d({ pieceLengthsMm: [500], extra: 1, stockLengthMm: 2400 }).ok,
    ).toBe(false);
  });
});
