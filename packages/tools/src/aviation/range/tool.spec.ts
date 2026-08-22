import { describe, expect, it } from "vitest";
import { rangeExample, runRange } from "./tool.js";
import { runEndurance } from "../endurance/tool.js";

describe("range calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRange(rangeExample.input)).toEqual({
      ok: true,
      output: rangeExample.output,
    });
  });

  it("equals endurance times ground speed", async () => {
    const endurance = runEndurance({
      fuelFlowLitersPerHour: rangeExample.input.fuelFlowLitersPerHour,
      usableFuelLiters: rangeExample.input.usableFuelLiters,
    });
    if (!endurance.ok) throw new Error("expected success");
    const range = runRange(rangeExample.input);
    if (!range.ok) throw new Error("expected success");
    expect(
      Math.abs(
        (range.output.rangeNm as number) -
          (endurance.output.enduranceHours as number) *
            rangeExample.input.groundSpeedKt,
      ),
    ).toBeLessThan(5e-10);
  });

  it("rejects non-positive ground speed through execution", () => {
    expect(
      runRange({
        fuelFlowLitersPerHour: 40,
        groundSpeedKt: 0,
        usableFuelLiters: 120,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_speed" }] },
      ok: false,
    });
  });
});
