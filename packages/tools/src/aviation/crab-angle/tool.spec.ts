import { describe, expect, it } from "vitest";
import { calculateCrabAngle, crabAngleExample, runCrabAngle } from "./tool.js";

describe("crab angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrabAngle(crabAngleExample.input)).toEqual({
      ok: true,
      output: crabAngleExample.output,
    });
  });

  it("is zero in still air", () => {
    expect(calculateCrabAngle({ crosswindKt: 0, trueAirspeedKt: 100 })).toEqual(
      {
        crabAngleDeg: 0,
      },
    );
  });

  it("rejects crosswinds beyond TAS through execution", () => {
    expect(
      runCrabAngle({ crosswindKt: 150, trueAirspeedKt: 100 }),
    ).toMatchObject({
      error: { issues: [{ code: "wind_exceeds_airspeed" }] },
      ok: false,
    });
  });
});
