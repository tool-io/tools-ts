import { describe, expect, it } from "vitest";
import { runHalfLifeBiology } from "./tool.js";

describe("Biological Half-Life", () => {
  it("calculates a valid result", () =>
    expect(
      runHalfLifeBiology({ clearanceLPerH: 7, volumeDistributionL: 70 }),
    ).toEqual({
      ok: true,
      output: { halfLifeHours: 6.931471805599452 },
    }));
  it("shortens with faster clearance", () =>
    expect(
      runHalfLifeBiology({ clearanceLPerH: 14, volumeDistributionL: 35 }),
    ).toEqual({ ok: true, output: { halfLifeHours: 1.732867951399863 } }));
  it("lengthens proportionally with volume", () =>
    expect(
      runHalfLifeBiology({ clearanceLPerH: 7, volumeDistributionL: 140 }),
    ).toEqual({
      ok: true,
      output: { halfLifeHours: 13.862943611198904 },
    }));
  it("reduces to ln(2) when clearance equals volume", () =>
    expect(
      runHalfLifeBiology({ clearanceLPerH: 3, volumeDistributionL: 3 }),
    ).toEqual({ ok: true, output: { halfLifeHours: 0.6931471805599453 } }));
  it("supports fractional kinetics", () =>
    expect(
      runHalfLifeBiology({ clearanceLPerH: 0.5, volumeDistributionL: 1 }),
    ).toEqual({ ok: true, output: { halfLifeHours: 1.3862943611198906 } }));
  it("rejects non-positive volumes", () => {
    const result = runHalfLifeBiology({
      clearanceLPerH: 7,
      volumeDistributionL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_volume");
  });
  it("rejects negative clearance", () => {
    const result = runHalfLifeBiology({
      clearanceLPerH: -7,
      volumeDistributionL: 70,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_clearance");
  });
});
