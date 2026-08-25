import { describe, expect, it } from "vitest";
import { runApoptoticIndex } from "./tool.js";

describe("Apoptotic Index", () => {
  it("calculates a valid result", () =>
    expect(
      runApoptoticIndex({ apoptoticCells: 75, mitoticCells: 150 }),
    ).toEqual({
      ok: true,
      output: { apoptoticIndex: 0.5 },
    }));
  it("returns zero with no apoptotic cells", () =>
    expect(runApoptoticIndex({ apoptoticCells: 0, mitoticCells: 80 })).toEqual({
      ok: true,
      output: { apoptoticIndex: 0 },
    }));
  it("exceeds one when apoptosis outpaces mitosis", () =>
    expect(
      runApoptoticIndex({ apoptoticCells: 300, mitoticCells: 150 }),
    ).toEqual({
      ok: true,
      output: { apoptoticIndex: 2 },
    }));
  it("rejects a zero mitotic count", () => {
    const result = runApoptoticIndex({
      apoptoticCells: 75,
      mitoticCells: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a negative mitotic count", () =>
    expect(
      runApoptoticIndex({ apoptoticCells: 75, mitoticCells: -150 }).ok,
    ).toBe(false));
  it("rejects fractional counts", () =>
    expect(
      runApoptoticIndex({ apoptoticCells: 7.5, mitoticCells: 15 }).ok,
    ).toBe(false));
});
