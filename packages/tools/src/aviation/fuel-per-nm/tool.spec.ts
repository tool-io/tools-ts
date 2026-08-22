import { describe, expect, it } from "vitest";
import { fuelPerNmExample, runFuelPerNm } from "./tool.js";

describe("fuel per nautical mile calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFuelPerNm(fuelPerNmExample.input)).toEqual({
      ok: true,
      output: fuelPerNmExample.output,
    });
  });

  it("drops as ground speed rises at fixed flow", () => {
    const slowResult = runFuelPerNm({
      fuelFlowLitersPerHour: 40,
      groundSpeedKt: 100,
    });
    const fastResult = runFuelPerNm({
      fuelFlowLitersPerHour: 40,
      groundSpeedKt: 140,
    });
    if (!slowResult.ok || !fastResult.ok) throw new Error("expected success");
    const slow = (slowResult.output as { litersPerNm: number }).litersPerNm;
    const fast = (fastResult.output as { litersPerNm: number }).litersPerNm;
    expect(fast).toBeLessThan(slow);
  });

  it("rejects zero ground speed through execution", () => {
    expect(
      runFuelPerNm({ fuelFlowLitersPerHour: 40, groundSpeedKt: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_speed" }] },
      ok: false,
    });
  });
});
