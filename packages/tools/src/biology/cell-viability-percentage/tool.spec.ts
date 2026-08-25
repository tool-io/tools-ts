import { describe, expect, it } from "vitest";
import { runCellViabilityPercentage } from "./tool.js";

describe("Cell Viability %", () => {
  it("calculates a valid result", () =>
    expect(runCellViabilityPercentage({ total: 100, viable: 87 })).toEqual({
      ok: true,
      output: { viabilityPercent: 87 },
    }));
  it("returns 100 percent when all cells are viable", () =>
    expect(runCellViabilityPercentage({ total: 100, viable: 100 })).toEqual({
      ok: true,
      output: { viabilityPercent: 100 },
    }));
  it("returns 0 percent with no viable cells", () =>
    expect(runCellViabilityPercentage({ total: 50, viable: 0 })).toEqual({
      ok: true,
      output: { viabilityPercent: 0 },
    }));
  it("scales partial counts proportionally", () =>
    expect(runCellViabilityPercentage({ total: 200, viable: 90 })).toEqual({
      ok: true,
      output: { viabilityPercent: 45 },
    }));
  it("rejects viable exceeding total", () => {
    const result = runCellViabilityPercentage({ total: 100, viable: 101 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total", () => {
    const result = runCellViabilityPercentage({ total: 0, viable: 5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects negative viable counts", () =>
    expect(runCellViabilityPercentage({ total: 10, viable: -1 }).ok).toBe(
      false,
    ));
});
