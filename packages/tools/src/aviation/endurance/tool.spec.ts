import { describe, expect, it } from "vitest";
import { enduranceExample, runEndurance } from "./tool.js";

describe("endurance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEndurance(enduranceExample.input)).toEqual({
      ok: true,
      output: enduranceExample.output,
    });
  });

  it("halves endurance when flow doubles", () => {
    expect(
      runEndurance({ fuelFlowLitersPerHour: 80, usableFuelLiters: 120 }),
    ).toEqual({ ok: true, output: { enduranceHours: 1.5 } });
  });

  it("rejects zero fuel flow through execution", () => {
    expect(
      runEndurance({ fuelFlowLitersPerHour: 0, usableFuelLiters: 120 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_flow" }] },
      ok: false,
    });
  });
});
