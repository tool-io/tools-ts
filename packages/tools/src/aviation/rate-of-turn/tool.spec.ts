import { describe, expect, it } from "vitest";
import { rateOfTurnExample, runRateOfTurn } from "./tool.js";
import { runTurnRadius } from "../turn-radius/tool.js";

describe("rate of turn calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRateOfTurn(rateOfTurnExample.input)).toEqual({
      ok: true,
      output: rateOfTurnExample.output,
    });
  });

  it("satisfies v = omega * radius with the turn radius tool", () => {
    const input = rateOfTurnExample.input;
    const rate = runRateOfTurn(input);
    const radius = runTurnRadius(input);
    if (!rate.ok || !radius.ok) throw new Error("expected success");
    const omegaRadPerS = ((rate.output.rateDegPerS as number) * Math.PI) / 180;
    expect(
      Math.abs(
        omegaRadPerS * (radius.output.radiusM as number) -
          input.trueAirspeedKt * 0.514444,
      ),
    ).toBeLessThan(1e-6);
  });

  it("rejects non-positive banks through execution", () => {
    expect(
      runRateOfTurn({ bankAngleDeg: 0, trueAirspeedKt: 120 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_bank_angle" }] },
      ok: false,
    });
  });

  it("rejects banks of ninety degrees or steeper through execution", () => {
    expect(
      runRateOfTurn({ bankAngleDeg: 120, trueAirspeedKt: 120 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_bank_angle" }] },
      ok: false,
    });
  });
});
