import { describe, expect, it } from "vitest";
import { activityNumberExample, runActivityNumber } from "./tool.js";

describe("activity-number", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runActivityNumber(activityNumberExample.input)).toEqual({
      ok: true,
      output: activityNumberExample.output,
    });
  });

  it("classifies illite-like soil near one", () => {
    const result = runActivityNumber({
      plasticityIndexPercent: 24,
      clayFractionPercent: 40,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.activity as number).toBe(0.6);
  });

  it("rejects a zero clay fraction", () => {
    expect(
      runActivityNumber({ plasticityIndexPercent: 22, clayFractionPercent: 0 })
        .ok,
    ).toBe(false);
  });
});
