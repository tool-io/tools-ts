import { describe, expect, it } from "vitest";
import { requiredReserveFuelExample, runRequiredReserveFuel } from "./tool.js";

describe("required reserve fuel calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRequiredReserveFuel(requiredReserveFuelExample.input)).toEqual({
      ok: true,
      output: requiredReserveFuelExample.output,
    });
  });

  it("defaults to forty-five minutes of reserve", () => {
    expect(runRequiredReserveFuel({ fuelFlowLitersPerHour: 40 })).toEqual({
      ok: true,
      output: { reserveLiters: 30 },
    });
  });

  it("rejects non-positive flow through execution", () => {
    expect(runRequiredReserveFuel({ fuelFlowLitersPerHour: -1 }).ok).toBe(
      false,
    );
  });
});
