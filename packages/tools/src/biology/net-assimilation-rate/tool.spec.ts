import { describe, expect, it } from "vitest";
import { netAssimilationRateExample, runNetAssimilationRate } from "./tool.js";

describe("Net Assimilation Rate", () => {
  it("publishes an executable example", () =>
    expect(runNetAssimilationRate(netAssimilationRateExample.input)).toEqual({
      ok: true,
      output: netAssimilationRateExample.output,
    }));
  it("calculates growth from bare seedlings", () =>
    expect(
      runNetAssimilationRate({
        daysElapsed: 8,
        dryMassW1G: 0,
        dryMassW2G: 40,
        leafAreaM2Average: 2,
      }),
    ).toEqual({ ok: true, output: { narGPerM2PerDay: 2.5 } }));
  it("is zero for stasis", () =>
    expect(
      runNetAssimilationRate({
        daysElapsed: 10,
        dryMassW1G: 120,
        dryMassW2G: 120,
        leafAreaM2Average: 0.5,
      }),
    ).toEqual({ ok: true, output: { narGPerM2PerDay: 0 } }));
  it("rejects mass loss", () => {
    const result = runNetAssimilationRate({
      daysElapsed: 10,
      dryMassW1G: 150,
      dryMassW2G: 100,
      leafAreaM2Average: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_masses");
  });
  it("rejects degenerate days", () =>
    expect(
      runNetAssimilationRate({
        daysElapsed: 0,
        dryMassW1G: 100,
        dryMassW2G: 150,
        leafAreaM2Average: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects zero leaf area", () =>
    expect(
      runNetAssimilationRate({
        daysElapsed: 10,
        dryMassW1G: 100,
        dryMassW2G: 150,
        leafAreaM2Average: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative initial mass", () =>
    expect(
      runNetAssimilationRate({
        daysElapsed: 10,
        dryMassW1G: -1,
        dryMassW2G: 150,
        leafAreaM2Average: 0.5,
      }).ok,
    ).toBe(false));
});
