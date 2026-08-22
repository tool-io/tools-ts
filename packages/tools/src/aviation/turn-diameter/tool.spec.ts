import { describe, expect, it } from "vitest";
import {
  calculateTurnDiameter,
  runTurnDiameter,
  turnDiameterExample,
} from "./tool.js";

describe("turn diameter calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTurnDiameter(turnDiameterExample.input)).toEqual({
      ok: true,
      output: turnDiameterExample.output,
    });
  });

  it("doubles the turn radius", async () => {
    const { runTurnRadius } = await import("../turn-radius/tool.js");
    const radius = runTurnRadius({ bankAngleDeg: 30, trueAirspeedKt: 120 });
    const diameter = runTurnDiameter({ bankAngleDeg: 30, trueAirspeedKt: 120 });
    if (!radius.ok || !diameter.ok) throw new Error("expected success");
    const radiusM = (radius.output as { radiusM: number }).radiusM;
    const diameterM = (diameter.output as { diameterM: number }).diameterM;
    expect(diameterM).toBeCloseTo(radiusM * 2, 6);
  });

  it("rejects zero bank through execution", () => {
    expect(
      runTurnDiameter({ bankAngleDeg: 0, trueAirspeedKt: 120 }),
    ).toMatchObject({
      error: { issues: [{ code: "undefined_turn_radius" }] },
      ok: false,
    });
  });
});
