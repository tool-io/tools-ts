import { describe, expect, it } from "vitest";
import { runSelectivityIndex } from "./tool.js";

describe("Selectivity Index", () => {
  it("calculates a valid result", () =>
    expect(runSelectivityIndex({ therapeuticIc50: 8, toxicIc50: 40 })).toEqual({
      ok: true,
      output: { selectivityIndex: 5 },
    }));
  it("reports one for equal potencies", () =>
    expect(runSelectivityIndex({ therapeuticIc50: 7, toxicIc50: 7 })).toEqual({
      ok: true,
      output: { selectivityIndex: 1 },
    }));
  it("supports fractional ratios", () =>
    expect(runSelectivityIndex({ therapeuticIc50: 4, toxicIc50: 3 })).toEqual({
      ok: true,
      output: { selectivityIndex: 0.75 },
    }));
  it("keeps decimal precision", () =>
    expect(
      runSelectivityIndex({ therapeuticIc50: 5, toxicIc50: 12.5 }),
    ).toEqual({ ok: true, output: { selectivityIndex: 2.5 } }));
  it("grows with wide safety margins", () =>
    expect(
      runSelectivityIndex({ therapeuticIc50: 2, toxicIc50: 1000 }),
    ).toEqual({ ok: true, output: { selectivityIndex: 500 } }));
  it("rejects non-positive therapeutic IC50", () => {
    const result = runSelectivityIndex({
      therapeuticIc50: 0,
      toxicIc50: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_ic50");
  });
  it("rejects non-positive toxic IC50", () => {
    const result = runSelectivityIndex({
      therapeuticIc50: 8,
      toxicIc50: -40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_ic50");
  });
});
