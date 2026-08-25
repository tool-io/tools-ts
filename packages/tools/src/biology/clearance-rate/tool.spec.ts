import { describe, expect, it } from "vitest";
import { runClearanceRate } from "./tool.js";

describe("Clearance Rate", () => {
  it("calculates a valid result", () =>
    expect(runClearanceRate({ aucMgHPerL: 125, doseMg: 500 })).toEqual({
      ok: true,
      output: { clearanceLPerHour: 4 },
    }));
  it("handles fractional AUC", () =>
    expect(runClearanceRate({ aucMgHPerL: 0.4, doseMg: 1 })).toEqual({
      ok: true,
      output: { clearanceLPerHour: 2.5 },
    }));
  it("shrinks for large exposure", () =>
    expect(runClearanceRate({ aucMgHPerL: 80, doseMg: 10 })).toEqual({
      ok: true,
      output: { clearanceLPerHour: 0.125 },
    }));
  it("scales linearly with dose", () =>
    expect(runClearanceRate({ aucMgHPerL: 125, doseMg: 1000 })).toEqual({
      ok: true,
      output: { clearanceLPerHour: 8 },
    }));
  it("reports one when dose matches AUC", () =>
    expect(runClearanceRate({ aucMgHPerL: 9, doseMg: 9 })).toEqual({
      ok: true,
      output: { clearanceLPerHour: 1 },
    }));
  it("rejects non-positive doses", () => {
    const result = runClearanceRate({ aucMgHPerL: 125, doseMg: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_dose");
  });
  it("rejects non-positive AUC", () => {
    const result = runClearanceRate({ aucMgHPerL: -125, doseMg: 500 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_auc");
  });
});
