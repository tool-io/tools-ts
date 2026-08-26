import { describe, expect, it } from "vitest";
import { runMitoticIndex } from "./tool.js";

describe("Mitotic Index %", () => {
  it("calculates a valid result", () =>
    expect(runMitoticIndex({ cellsInMitosis: 24, totalCells: 200 })).toEqual({
      ok: true,
      output: { mitoticIndexPercent: 12 },
    }));
  it("returns zero with no mitotic cells", () =>
    expect(runMitoticIndex({ cellsInMitosis: 0, totalCells: 80 })).toEqual({
      ok: true,
      output: { mitoticIndexPercent: 0 },
    }));
  it("returns one hundred when every cell divides", () =>
    expect(runMitoticIndex({ cellsInMitosis: 100, totalCells: 100 })).toEqual({
      ok: true,
      output: { mitoticIndexPercent: 100 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runMitoticIndex({ cellsInMitosis: 101, totalCells: 100 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runMitoticIndex({ cellsInMitosis: 5, totalCells: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative mitotic counts", () =>
    expect(runMitoticIndex({ cellsInMitosis: -1, totalCells: 10 }).ok).toBe(
      false,
    ));
});
