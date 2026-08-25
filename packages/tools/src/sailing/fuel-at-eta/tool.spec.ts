import { describe, expect, it } from "vitest";
import { calculateFuelAtEta, fuelAtEtaExample, runFuelAtEta } from "./tool.js";

describe("Fuel At ETA Calculator", () => {
  it("publishes an executable example", () =>
    expect(runFuelAtEta(fuelAtEtaExample.input)).toEqual({
      ok: true,
      output: fuelAtEtaExample.output,
    }));

  it.each([
    [4.5, 2, 9],
    [10, 3.5, 35],
    [2.5, 0.5, 1.25],
    [7, 1, 7],
    [0.75, 4, 3],
  ])(
    "multiplies burn rate by hours to arrival",
    (burnLitersPerHour, etaHours, expected) => {
      expect(calculateFuelAtEta({ burnLitersPerHour, etaHours })).toEqual({
        fuelUsedLiters: expected,
      });
    },
  );

  it("consumes no fuel for an immediate arrival", () => {
    expect(runFuelAtEta({ burnLitersPerHour: 6, etaHours: 0 })).toEqual({
      ok: true,
      output: { fuelUsedLiters: 0 },
    });
  });

  it("scales linearly with both inputs", () => {
    const base = calculateFuelAtEta({
      burnLitersPerHour: 5,
      etaHours: 2,
    })!.fuelUsedLiters;
    expect(
      calculateFuelAtEta({ burnLitersPerHour: 10, etaHours: 2 })
        ?.fuelUsedLiters,
    ).toBe(base * 2);
    expect(
      calculateFuelAtEta({ burnLitersPerHour: 5, etaHours: 4 })?.fuelUsedLiters,
    ).toBe(base * 2);
  });

  it("returns zero for a zero burn rate", () => {
    expect(calculateFuelAtEta({ burnLitersPerHour: 0, etaHours: 2 })).toEqual({
      fuelUsedLiters: 0,
    });
  });

  it.each([[-4]])("rejects negative burn rates", (burnLitersPerHour) => {
    expect(calculateFuelAtEta({ burnLitersPerHour, etaHours: 2 })).toBeNull();
    const result = runFuelAtEta({ burnLitersPerHour, etaHours: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_value");
  });

  it("rejects negative ETAs at the schema level", () => {
    expect(runFuelAtEta({ burnLitersPerHour: 5, etaHours: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects unknown fields and missing inputs", () => {
    expect(runFuelAtEta({ burnLitersPerHour: 5, tankSize: 40 })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "tankSize" }] },
      ok: false,
    });
    expect(runFuelAtEta({ etaHours: 2 } as never).ok).toBe(false);
  });
});
