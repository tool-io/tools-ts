import { describe, expect, it } from "vitest";
import { finalReserveFuelExample, runFinalReserveFuel } from "./tool.js";

describe("final reserve fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFinalReserveFuel(finalReserveFuelExample.input)).toEqual({
      ok: true,
      output: finalReserveFuelExample.output,
    });
  });

  it("defaults to thirty minutes of holding", () => {
    expect(runFinalReserveFuel({ burnRateKgPerHour: 2400 })).toEqual({
      ok: true,
      output: { finalReserveFuelKg: 1200 },
    });
  });

  it("covers a forty-five minute hold", () => {
    expect(
      runFinalReserveFuel({ burnRateKgPerHour: 2600, holdMinutes: 45 }),
    ).toEqual({ ok: true, output: { finalReserveFuelKg: 1950 } });
  });

  it("rejects a zero burn rate", () => {
    expect(
      runFinalReserveFuel({ burnRateKgPerHour: 0, holdMinutes: 30 }).ok,
    ).toBe(false);
  });

  it("rejects a negative burn rate", () => {
    expect(
      runFinalReserveFuel({ burnRateKgPerHour: -100, holdMinutes: 30 }).ok,
    ).toBe(false);
  });

  it("rejects zero hold minutes", () => {
    expect(
      runFinalReserveFuel({ burnRateKgPerHour: 2400, holdMinutes: 0 }).ok,
    ).toBe(false);
  });

  it("rejects negative hold minutes", () => {
    expect(
      runFinalReserveFuel({ burnRateKgPerHour: 2400, holdMinutes: -30 }).ok,
    ).toBe(false);
  });

  it("requires the burn rate", () => {
    expect(runFinalReserveFuel({ holdMinutes: 30 }).ok).toBe(false);
  });

  it("computes a realistic widebody reserve", () => {
    expect(
      runFinalReserveFuel({ burnRateKgPerHour: 3000, holdMinutes: 45 }),
    ).toEqual({ ok: true, output: { finalReserveFuelKg: 2250 } });
  });
});
