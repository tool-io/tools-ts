import { describe, expect, it } from "vitest";
import { diversionFuelExample, runDiversionFuel } from "./tool.js";

describe("diversion fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiversionFuel(diversionFuelExample.input)).toEqual({
      ok: true,
      output: diversionFuelExample.output,
    });
  });

  it("defaults to a two hundred kilogram approach allowance", () => {
    expect(
      runDiversionFuel({
        burnRateKgPerHour: 2400,
        distanceNm: 200,
        groundSpeedKt: 400,
      }),
    ).toEqual({ ok: true, output: { diversionFuelKg: 1400 } });
  });

  it("allows a zero approach allowance", () => {
    expect(
      runDiversionFuel({
        approachAllowanceKg: 0,
        burnRateKgPerHour: 1200,
        distanceNm: 100,
        groundSpeedKt: 200,
      }),
    ).toEqual({ ok: true, output: { diversionFuelKg: 600 } });
  });

  it("rejects zero distance", () => {
    expect(
      runDiversionFuel({
        burnRateKgPerHour: 2400,
        distanceNm: 0,
        groundSpeedKt: 400,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero ground speed", () => {
    expect(
      runDiversionFuel({
        burnRateKgPerHour: 2400,
        distanceNm: 200,
        groundSpeedKt: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero burn rate", () => {
    expect(
      runDiversionFuel({
        burnRateKgPerHour: 0,
        distanceNm: 200,
        groundSpeedKt: 400,
      }).ok,
    ).toBe(false);
  });

  it("rejects a negative approach allowance", () => {
    expect(
      runDiversionFuel({
        approachAllowanceKg: -1,
        burnRateKgPerHour: 2400,
        distanceNm: 200,
        groundSpeedKt: 400,
      }).ok,
    ).toBe(false);
  });

  it("rejects a negative distance", () => {
    expect(
      runDiversionFuel({
        burnRateKgPerHour: 2400,
        distanceNm: -200,
        groundSpeedKt: 400,
      }).ok,
    ).toBe(false);
  });

  it("computes a realistic longer diversion", () => {
    expect(
      runDiversionFuel({
        approachAllowanceKg: 250,
        burnRateKgPerHour: 2800,
        distanceNm: 300,
        groundSpeedKt: 400,
      }),
    ).toEqual({ ok: true, output: { diversionFuelKg: 2350 } });
  });

  it("requires the core diversion inputs", () => {
    expect(
      runDiversionFuel({
        burnRateKgPerHour: 2400,
        groundSpeedKt: 400,
      }).ok,
    ).toBe(false);
  });
});
