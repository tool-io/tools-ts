import { describe, expect, it } from "vitest";
import { jokerFuelExample, runJokerFuel } from "./tool.js";

describe("joker fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJokerFuel(jokerFuelExample.input)).toEqual({
      ok: true,
      output: jokerFuelExample.output,
    });
  });

  it("sums all-zero components to zero", () => {
    expect(runJokerFuel({ bingoFuelKg: 0, plannedMarginKg: 0 })).toEqual({
      ok: true,
      output: { jokerFuelKg: 0 },
    });
  });

  it("reduces to the bingo state with a zero margin", () => {
    expect(runJokerFuel({ bingoFuelKg: 4500, plannedMarginKg: 0 })).toEqual({
      ok: true,
      output: { jokerFuelKg: 4500 },
    });
  });

  it("reduces to the margin with zero bingo fuel", () => {
    expect(runJokerFuel({ bingoFuelKg: 0, plannedMarginKg: 750 })).toEqual({
      ok: true,
      output: { jokerFuelKg: 750 },
    });
  });

  it("sums fractional components exactly", () => {
    expect(
      runJokerFuel({ bingoFuelKg: 1234.5, plannedMarginKg: 65.5 }),
    ).toEqual({ ok: true, output: { jokerFuelKg: 1300 } });
  });

  it("rejects a negative bingo fuel with the schema code", () => {
    const result = runJokerFuel({ bingoFuelKg: -1, plannedMarginKg: 100 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a negative planned margin", () => {
    expect(runJokerFuel({ bingoFuelKg: 4500, plannedMarginKg: -10 }).ok).toBe(
      false,
    );
  });

  it("requires both components", () => {
    expect(runJokerFuel({ plannedMarginKg: 500 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(
      runJokerFuel({ bingoFuelKg: Number.NaN, plannedMarginKg: 500 }).ok,
    ).toBe(false);
  });

  it("computes a realistic fighter joker state", () => {
    expect(runJokerFuel({ bingoFuelKg: 6500, plannedMarginKg: 300 })).toEqual({
      ok: true,
      output: { jokerFuelKg: 6800 },
    });
  });
});
