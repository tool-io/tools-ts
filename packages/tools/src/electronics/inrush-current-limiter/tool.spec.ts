import { describe, expect, it } from "vitest";
import { runInrushCurrentLimiter } from "./tool.js";
describe("NTC Inrush Peak", () => {
  it("calculates peak current for a mains bus", () =>
    expect(
      runInrushCurrentLimiter({ busVolts: 230, ntcColdResistanceOhms: 10 }),
    ).toEqual({
      ok: true,
      output: { inrushPeakCurrentA: 23 },
    }));
  it("calculates peak current for a low-voltage bus", () =>
    expect(
      runInrushCurrentLimiter({ busVolts: 12, ntcColdResistanceOhms: 5 }),
    ).toEqual({
      ok: true,
      output: { inrushPeakCurrentA: 2.4 },
    }));
  it("handles fractional results", () =>
    expect(
      runInrushCurrentLimiter({ busVolts: 5, ntcColdResistanceOhms: 3 }),
    ).toEqual({
      ok: true,
      output: { inrushPeakCurrentA: 1.6666666666666667 },
    }));
  it("rejects a zero bus voltage", () =>
    expect(
      runInrushCurrentLimiter({ busVolts: 0, ntcColdResistanceOhms: 10 }).ok,
    ).toBe(false));
  it("rejects a negative bus voltage", () =>
    expect(
      runInrushCurrentLimiter({ busVolts: -230, ntcColdResistanceOhms: 10 }).ok,
    ).toBe(false));
  it("rejects a zero cold resistance", () =>
    expect(
      runInrushCurrentLimiter({ busVolts: 230, ntcColdResistanceOhms: 0 }).ok,
    ).toBe(false));
});
