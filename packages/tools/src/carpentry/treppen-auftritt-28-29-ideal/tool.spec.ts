import { describe, expect, it } from "vitest";
import { treadDepthCheckExample, runTreadDepthCheck } from "./tool.js";

describe("Tread Depth Check", () => {
  it("computes the canonical example", () =>
    expect(runTreadDepthCheck(treadDepthCheckExample.input)).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 0, isIdealTread: true },
    }));

  it("treats the lower ideal bound of 28 as ideal", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 28 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 0, isIdealTread: true },
    }));

  it("treats mid-range treads as ideal", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 28.5 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 0, isIdealTread: true },
    }));

  it("reports the deviation below the ideal range", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 27 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 1, isIdealTread: false },
    }));

  it("reports the deviation above the ideal range", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 31 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 2, isIdealTread: false },
    }));

  it("uses the exact lower input boundary of 20", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 20 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 8, isIdealTread: false },
    }));

  it("uses the exact upper input boundary of 35", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 35 })).toEqual({
      ok: true,
      output: { deviationFromIdealCm: 6, isIdealTread: false },
    }));

  it("rejects values just below the lower boundary", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 19.9 }).ok).toBe(false));

  it("rejects values just above the upper boundary", () =>
    expect(runTreadDepthCheck({ treadDepthCm: 35.1 }).ok).toBe(false));

  it("rejects a missing tread depth", () => {
    const result = runTreadDepthCheck({});
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "treadDepthCm",
        message: "Tread depth is invalid.",
      });
  });

  it("rejects non-finite tread depths", () =>
    expect(
      runTreadDepthCheck({ treadDepthCm: Number.NEGATIVE_INFINITY }).ok,
    ).toBe(false));

  it("rejects unknown input fields", () => {
    const result = runTreadDepthCheck({ riserHeightCm: 17 } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
