import { describe, expect, it } from "vitest";
import { runTaxiFuel, taxiFuelExample } from "./tool.js";

describe("taxi fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTaxiFuel(taxiFuelExample.input)).toEqual({
      ok: true,
      output: taxiFuelExample.output,
    });
  });

  it("treats sixty minutes of taxi as the hourly rate", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: 300, taxiMinutes: 60 })).toEqual({
      ok: true,
      output: { taxiFuelKg: 300 },
    });
  });

  it("scales proportionally for fractional hours", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: 40, taxiMinutes: 90 })).toEqual({
      ok: true,
      output: { taxiFuelKg: 60 },
    });
  });

  it("rejects a zero burn rate", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: 0, taxiMinutes: 10 }).ok).toBe(
      false,
    );
  });

  it("rejects zero taxi minutes", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: 240, taxiMinutes: 0 }).ok).toBe(
      false,
    );
  });

  it("rejects a negative burn rate", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: -1, taxiMinutes: 10 }).ok).toBe(
      false,
    );
  });

  it("rejects negative taxi minutes", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: 240, taxiMinutes: -5 }).ok).toBe(
      false,
    );
  });

  it("requires both inputs", () => {
    expect(runTaxiFuel({ taxiMinutes: 12 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(
      runTaxiFuel({ burnRateKgPerHour: Number.NaN, taxiMinutes: 12 }).ok,
    ).toBe(false);
  });

  it("computes a realistic narrowbody taxi allowance", () => {
    expect(runTaxiFuel({ burnRateKgPerHour: 660, taxiMinutes: 15 })).toEqual({
      ok: true,
      output: { taxiFuelKg: 165 },
    });
  });
});
