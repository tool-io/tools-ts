import { describe, expect, it } from "vitest";
import { fuelBurnExample, runFuelBurn } from "./tool.js";
import { runEndurance } from "../endurance/tool.js";

describe("fuel burn calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFuelBurn(fuelBurnExample.input)).toEqual({
      ok: true,
      output: fuelBurnExample.output,
    });
  });

  it("round-trips with the endurance calculator", () => {
    const burn = runFuelBurn(fuelBurnExample.input);
    if (!burn.ok) throw new Error("expected success");
    expect(
      runEndurance({
        fuelFlowLitersPerHour: 40,
        usableFuelLiters: burn.output.fuelBurnedLiters,
      }),
    ).toEqual({ ok: true, output: { enduranceHours: 2.5 } });
  });

  it("rejects negative inputs through execution", () => {
    expect(runFuelBurn({ flightHours: -1, fuelFlowLitersPerHour: 40 }).ok).toBe(
      false,
    );
  });
});
