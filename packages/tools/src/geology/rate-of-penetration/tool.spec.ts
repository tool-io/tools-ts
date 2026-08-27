import { describe, expect, it } from "vitest";
import { rateOfPenetrationExample, runRateOfPenetration } from "./tool.js";

describe("rate-of-penetration", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRateOfPenetration(rateOfPenetrationExample.input)).toEqual({
      ok: true,
      output: rateOfPenetrationExample.output,
    });
  });

  it("converts a one-hour metre-per-minute pace to metres per hour", () => {
    const result = runRateOfPenetration({
      drillingTimeMinutes: 60,
      metresDrilled: 25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateOfPenetrationMetresPerHour).toBe(25);
  });

  it("rejects non-positive times", () => {
    expect(
      runRateOfPenetration({ drillingTimeMinutes: 0, metresDrilled: 30 }).ok,
    ).toBe(false);
  });
});
