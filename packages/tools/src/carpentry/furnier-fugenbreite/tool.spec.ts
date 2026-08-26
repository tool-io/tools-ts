import { describe, expect, it } from "vitest";
import { runVeneerJointGap, veneerJointGapExample } from "./tool.js";

describe("Veneer Joint Gap Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runVeneerJointGap(veneerJointGapExample.input)).toEqual({
      ok: true,
      output: veneerJointGapExample.output,
    }));

  it("applies the default shrinkage of 0.5 percent", () =>
    expect(runVeneerJointGap({ veneerSheetWidthMm: 600 })).toEqual({
      ok: true,
      output: { gapMillimeters: 3 },
    }));

  it("scales the gap linearly with sheet width", () =>
    expect(
      runVeneerJointGap({ shrinkagePercent: 0.5, veneerSheetWidthMm: 1200 }),
    ).toEqual({
      ok: true,
      output: { gapMillimeters: 6 },
    }));

  it("returns a zero gap for zero shrinkage", () =>
    expect(
      runVeneerJointGap({ shrinkagePercent: 0, veneerSheetWidthMm: 600 }),
    ).toEqual({
      ok: true,
      output: { gapMillimeters: 0 },
    }));

  it("accepts the maximum shrinkage of five percent", () =>
    expect(
      runVeneerJointGap({ shrinkagePercent: 5, veneerSheetWidthMm: 600 }),
    ).toEqual({
      ok: true,
      output: { gapMillimeters: 30 },
    }));

  it("calculates a narrow sheet with two percent shrinkage", () =>
    expect(
      runVeneerJointGap({ shrinkagePercent: 2, veneerSheetWidthMm: 200 }),
    ).toEqual({
      ok: true,
      output: { gapMillimeters: 4 },
    }));

  it("rejects a zero or negative sheet width", () => {
    for (const veneerSheetWidthMm of [0, -600]) {
      const result = runVeneerJointGap({ veneerSheetWidthMm });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_veneer_width");
    }
  });

  it("rejects shrinkage outside the zero to five percent range", () => {
    for (const shrinkagePercent of [-0.1, 5.01]) {
      const result = runVeneerJointGap({
        shrinkagePercent,
        veneerSheetWidthMm: 600,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_field");
    }
  });

  it("rejects a missing sheet width", () => {
    const result = runVeneerJointGap({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite input", () =>
    expect(
      runVeneerJointGap({
        shrinkagePercent: Number.NaN,
        veneerSheetWidthMm: 600,
      }).ok,
    ).toBe(false));

  it("rejects unknown input fields", () =>
    expect(
      runVeneerJointGap({ veneerSheetWidthMm: 600, extra: 1 } as never).ok,
    ).toBe(false));
});
