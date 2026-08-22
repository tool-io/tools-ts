import { describe, expect, it } from "vitest";
import { bingoFuelExample, runBingoFuel } from "./tool.js";

describe("bingo fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBingoFuel(bingoFuelExample.input)).toEqual({
      ok: true,
      output: bingoFuelExample.output,
    });
  });

  it("sums all-zero components to zero", () => {
    expect(runBingoFuel({ reserveFuelKg: 0, transitFuelKg: 0 })).toEqual({
      ok: true,
      output: { bingoFuelKg: 0 },
    });
  });

  it("reduces to the reserve when transit is zero", () => {
    expect(runBingoFuel({ reserveFuelKg: 1200, transitFuelKg: 0 })).toEqual({
      ok: true,
      output: { bingoFuelKg: 1200 },
    });
  });

  it("reduces to the transit fuel when the reserve is zero", () => {
    expect(runBingoFuel({ reserveFuelKg: 0, transitFuelKg: 800 })).toEqual({
      ok: true,
      output: { bingoFuelKg: 800 },
    });
  });

  it("rejects a negative transit fuel", () => {
    expect(runBingoFuel({ reserveFuelKg: 1000, transitFuelKg: -1 }).ok).toBe(
      false,
    );
  });

  it("rejects a negative reserve", () => {
    expect(runBingoFuel({ reserveFuelKg: -500, transitFuelKg: 100 }).ok).toBe(
      false,
    );
  });

  it("computes a realistic fighter bingo state", () => {
    expect(runBingoFuel({ reserveFuelKg: 1300, transitFuelKg: 5200 })).toEqual({
      ok: true,
      output: { bingoFuelKg: 6500 },
    });
  });

  it("requires both components", () => {
    expect(runBingoFuel({ transitFuelKg: 1000 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(
      runBingoFuel({ reserveFuelKg: Number.NaN, transitFuelKg: 1000 }).ok,
    ).toBe(false);
  });
});
