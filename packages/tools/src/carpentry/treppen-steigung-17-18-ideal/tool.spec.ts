import { describe, expect, it } from "vitest";
import { riserHeightCheckExample, runRiserHeightCheck } from "./tool.js";

describe("Riser Height Check", () => {
  it("computes the canonical example", () =>
    expect(runRiserHeightCheck(riserHeightCheckExample.input)).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 0, isIdealRiser: true },
    }));

  it("treats the upper ideal bound of 18 as ideal", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 18 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 0, isIdealRiser: true },
    }));

  it("treats mid-range risers as ideal", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 17.5 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 0, isIdealRiser: true },
    }));

  it("reports the deviation below the ideal range", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 16 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 1, isIdealRiser: false },
    }));

  it("reports the deviation above the ideal range", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 20 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 2, isIdealRiser: false },
    }));

  it("uses the exact lower input boundary of 10", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 10 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 7, isIdealRiser: false },
    }));

  it("uses the exact upper input boundary of 25", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 25 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 7, isIdealRiser: false },
    }));

  it("rejects values just below the lower boundary", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 9.9 }).ok).toBe(false));

  it("rejects values just above the upper boundary", () =>
    expect(runRiserHeightCheck({ riserHeightCm: 25.1 }).ok).toBe(false));

  it("rejects a missing riser height", () => {
    const result = runRiserHeightCheck({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "riserHeightCm",
        message: "Riser height is invalid.",
      });
  });

  it("rejects non-finite riser heights", () =>
    expect(runRiserHeightCheck({ riserHeightCm: Number.NaN }).ok).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runRiserHeightCheck({ stepCount: 16 } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
