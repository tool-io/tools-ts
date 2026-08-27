import { describe, expect, it } from "vitest";
import { runTransferrinSaturation } from "./tool.js";

describe("Transferrin Saturation %", () => {
  it("divides iron by capacity and scales to percent", () =>
    expect(
      runTransferrinSaturation({
        serumIronUgdL: 80,
        transferrinCapacityUgdL: 300,
      }),
    ).toEqual({
      ok: true,
      output: { transferrinSaturationPercent: 26.666666666666668 },
    }));
  it("reports full saturation when iron equals capacity", () =>
    expect(
      runTransferrinSaturation({
        serumIronUgdL: 300,
        transferrinCapacityUgdL: 300,
      }),
    ).toEqual({ ok: true, output: { transferrinSaturationPercent: 100 } }));
  it("yields zero saturation without serum iron", () =>
    expect(
      runTransferrinSaturation({
        serumIronUgdL: 0,
        transferrinCapacityUgdL: 300,
      }),
    ).toEqual({ ok: true, output: { transferrinSaturationPercent: 0 } }));
  it("keeps fractional saturations for odd capacities", () =>
    expect(
      runTransferrinSaturation({
        serumIronUgdL: 45,
        transferrinCapacityUgdL: 350,
      }),
    ).toEqual({
      ok: true,
      output: { transferrinSaturationPercent: 12.857142857142856 },
    }));
  it("rejects a non positive capacity", () => {
    const result = runTransferrinSaturation({
      serumIronUgdL: 80,
      transferrinCapacityUgdL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_capacity");
  });
  it("rejects iron above capacity with invalid_iron_values", () => {
    const result = runTransferrinSaturation({
      serumIronUgdL: 400,
      transferrinCapacityUgdL: 300,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_iron_values");
  });
  it("rejects negative iron values with invalid_iron_values", () => {
    const result = runTransferrinSaturation({
      serumIronUgdL: -5,
      transferrinCapacityUgdL: 300,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.issues[0].code).toBe("invalid_iron_values");
      expect(result.error.issues[0].field).toBe("serumIronUgdL");
    }
  });
});
