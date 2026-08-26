import { describe, expect, it } from "vitest";
import {
  infillGapSafetyCheckExample,
  runInfillGapSafetyCheck,
} from "./tool.js";

describe("Infill Gap Safety Check", () => {
  it("computes the canonical example", () =>
    expect(runInfillGapSafetyCheck(infillGapSafetyCheckExample.input)).toEqual({
      ok: true,
      output: { isChildSafe: true, maxAllowedGapCm: 12 },
    }));

  it("accepts a gap exactly at the twelve centimeter limit", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 12 })).toEqual({
      ok: true,
      output: { isChildSafe: true, maxAllowedGapCm: 12 },
    }));

  it("rejects a gap just above the limit", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 12.1 })).toEqual({
      ok: true,
      output: { isChildSafe: false, maxAllowedGapCm: 12 },
    }));

  it("accepts a zero gap at the lower boundary", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 0 })).toEqual({
      ok: true,
      output: { isChildSafe: true, maxAllowedGapCm: 12 },
    }));

  it("flags the maximum measurable gap of thirty centimeters", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 30 })).toEqual({
      ok: true,
      output: { isChildSafe: false, maxAllowedGapCm: 12 },
    }));

  it("flags typical unsafe gaps", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 20 })).toEqual({
      ok: true,
      output: { isChildSafe: false, maxAllowedGapCm: 12 },
    }));

  it("keeps the reported limit constant at twelve centimeters", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 5 }).ok).toBe(true));

  it("rejects negative gaps", () =>
    expect(runInfillGapSafetyCheck({ gapCm: -0.1 }).ok).toBe(false));

  it("rejects gaps above thirty centimeters", () =>
    expect(runInfillGapSafetyCheck({ gapCm: 30.1 }).ok).toBe(false));

  it("rejects non-finite gaps", () =>
    expect(runInfillGapSafetyCheck({ gapCm: Number.NaN }).ok).toBe(false));

  it("rejects a missing gap", () => {
    const result = runInfillGapSafetyCheck({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "gapCm",
        message: "Gap is invalid.",
      });
  });

  it("rejects unknown input fields", () => {
    const result = runInfillGapSafetyCheck({
      gapCm: 10,
      isChildSafe: true,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
