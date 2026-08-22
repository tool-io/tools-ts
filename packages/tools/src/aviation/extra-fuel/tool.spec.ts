import { describe, expect, it } from "vitest";
import { extraFuelExample, runExtraFuel } from "./tool.js";

describe("extra fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runExtraFuel(extraFuelExample.input)).toEqual({
      ok: true,
      output: extraFuelExample.output,
    });
  });

  it("returns zero for equal requests", () => {
    expect(
      runExtraFuel({
        plannedBlockFuelKg: 12000,
        totalRequestedFuelKg: 12000,
      }),
    ).toEqual({ ok: true, output: { extraFuelKg: 0 } });
  });

  it("sums all-zero inputs to zero", () => {
    expect(
      runExtraFuel({ plannedBlockFuelKg: 0, totalRequestedFuelKg: 0 }),
    ).toEqual({ ok: true, output: { extraFuelKg: 0 } });
  });

  it("reduces to the request with a zero plan", () => {
    expect(
      runExtraFuel({ plannedBlockFuelKg: 0, totalRequestedFuelKg: 500 }),
    ).toEqual({ ok: true, output: { extraFuelKg: 500 } });
  });

  it("rejects an insufficient request with the stable code", () => {
    const result = runExtraFuel({
      plannedBlockFuelKg: 15600,
      totalRequestedFuelKg: 15000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.issues[0]?.code).toBe("insufficient_request");
      expect(result.error.issues[0]?.field).toBe("totalRequestedFuelKg");
    }
  });

  it("rejects a negative requested fuel", () => {
    expect(
      runExtraFuel({ plannedBlockFuelKg: 0, totalRequestedFuelKg: -1 }).ok,
    ).toBe(false);
  });

  it("rejects a negative planned block fuel", () => {
    expect(
      runExtraFuel({ plannedBlockFuelKg: -5, totalRequestedFuelKg: 100 }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runExtraFuel({ totalRequestedFuelKg: 16000 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(
      runExtraFuel({
        plannedBlockFuelKg: Number.NaN,
        totalRequestedFuelKg: 16000,
      }).ok,
    ).toBe(false);
  });

  it("computes a realistic tanker uplift margin", () => {
    expect(
      runExtraFuel({
        plannedBlockFuelKg: 39500,
        totalRequestedFuelKg: 42000,
      }),
    ).toEqual({ ok: true, output: { extraFuelKg: 2500 } });
  });
});
