import { describe, expect, it } from "vitest";
import { runPressureAltitudeCorrectedTemp } from "./tool.js";
describe("ISA Deviation Calculator", () => {
  it("returns zero deviation on an ISA day at sea level", () =>
    expect(
      runPressureAltitudeCorrectedTemp({ oatC: 15, pressureAltitudeFt: 0 }),
    ).toEqual({ ok: true, output: { isaDeviationC: 0 } }));
  it("computes a warm deviation aloft", () => {
    const result = runPressureAltitudeCorrectedTemp({
      oatC: 10,
      pressureAltitudeFt: 5000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.isaDeviationC).toBeCloseTo(4.906, 12);
  });
  it("computes a cold deviation aloft", () => {
    const result = runPressureAltitudeCorrectedTemp({
      oatC: -25,
      pressureAltitudeFt: 10000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.isaDeviationC).toBeCloseTo(-20.188, 12);
  });
  it("supports negative pressure altitudes", () => {
    const result = runPressureAltitudeCorrectedTemp({
      oatC: -80,
      pressureAltitudeFt: -1000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.isaDeviationC).toBeCloseTo(-96.9812, 12);
  });
  it("accepts the altitude bounds", () => {
    for (const pressureAltitudeFt of [-1000, 20000]) {
      const result = runPressureAltitudeCorrectedTemp({
        oatC: 15,
        pressureAltitudeFt,
      });
      expect(result.ok).toBe(true);
    }
  });
  it("rejects altitudes above the bound", () =>
    expect(
      runPressureAltitudeCorrectedTemp({
        oatC: 15,
        pressureAltitudeFt: 20001,
      }).ok,
    ).toBe(false));
  it("rejects temperatures above the bound", () =>
    expect(
      runPressureAltitudeCorrectedTemp({
        oatC: 60.5,
        pressureAltitudeFt: 0,
      }).ok,
    ).toBe(false));
  it("rejects temperatures below the bound", () =>
    expect(
      runPressureAltitudeCorrectedTemp({
        oatC: -80.5,
        pressureAltitudeFt: 0,
      }).ok,
    ).toBe(false));
});
