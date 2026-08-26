import { describe, expect, it } from "vitest";
import { runNecroticIndex } from "./tool.js";

describe("Necrotic Index", () => {
  it("calculates a valid result", () =>
    expect(runNecroticIndex({ necroticCells: 60, totalCells: 600 })).toEqual({
      ok: true,
      output: { necroticIndexPercent: 10 },
    }));
  it("returns zero with no necrotic cells", () =>
    expect(runNecroticIndex({ necroticCells: 0, totalCells: 45 })).toEqual({
      ok: true,
      output: { necroticIndexPercent: 0 },
    }));
  it("returns one hundred when all cells are necrotic", () =>
    expect(runNecroticIndex({ necroticCells: 30, totalCells: 30 })).toEqual({
      ok: true,
      output: { necroticIndexPercent: 100 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runNecroticIndex({ necroticCells: 31, totalCells: 30 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runNecroticIndex({ necroticCells: 5, totalCells: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative counts", () =>
    expect(runNecroticIndex({ necroticCells: -3, totalCells: 30 }).ok).toBe(
      false,
    ));
});
