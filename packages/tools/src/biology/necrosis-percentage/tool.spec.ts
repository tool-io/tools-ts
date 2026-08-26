import { describe, expect, it } from "vitest";
import { runNecrosisPercentage } from "./tool.js";

describe("Necrosis %", () => {
  it("calculates a valid result", () =>
    expect(
      runNecrosisPercentage({ necroticCells: 50, totalCells: 400 }),
    ).toEqual({
      ok: true,
      output: { necrosisPercent: 12.5 },
    }));
  it("returns zero with no necrotic cells", () =>
    expect(runNecrosisPercentage({ necroticCells: 0, totalCells: 60 })).toEqual(
      {
        ok: true,
        output: { necrosisPercent: 0 },
      },
    ));
  it("returns one hundred when all cells are necrotic", () =>
    expect(
      runNecrosisPercentage({ necroticCells: 30, totalCells: 30 }),
    ).toEqual({
      ok: true,
      output: { necrosisPercent: 100 },
    }));
  it("rejects counts exceeding the total", () => {
    const result = runNecrosisPercentage({ necroticCells: 31, totalCells: 30 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runNecrosisPercentage({ necroticCells: 2, totalCells: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative necrotic counts", () =>
    expect(
      runNecrosisPercentage({ necroticCells: -3, totalCells: 20 }).ok,
    ).toBe(false));
});
