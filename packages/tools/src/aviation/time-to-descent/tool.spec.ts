import { describe, expect, it } from "vitest";
import { timeToDescentExample, runTimeToDescent } from "./tool.js";

describe("time to descent calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTimeToDescent(timeToDescentExample.input)).toEqual({
      ok: true,
      output: timeToDescentExample.output,
    });
  });

  it("halves the time when the rate doubles", () => {
    const result = runTimeToDescent({
      altitudeToLoseFt: 10000,
      descentRateFpm: 1000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output).toEqual({ minutes: 10 });
  });
  it("rejects zero descent rate through execution", () => {
    expect(
      runTimeToDescent({ altitudeToLoseFt: 1000, descentRateFpm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rate" }] },
      ok: false,
    });
  });
});
