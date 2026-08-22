import { describe, expect, it } from "vitest";
import { oxygenRequiredExample, runOxygenRequired } from "./tool.js";

describe("oxygen required calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOxygenRequired(oxygenRequiredExample.input)).toEqual({
      ok: true,
      output: oxygenRequiredExample.output,
    });
  });

  it("scales with duration and flow", () => {
    const doubledResult = runOxygenRequired({
      durationMinutes: 60,
      flowLitersPerMinute: 12,
    });
    if (!doubledResult.ok) throw new Error("expected success");
    const doubled = (doubledResult.output as { oxygenLiters: number })
      .oxygenLiters;
    expect(doubled).toBe(720);
  });

  it("rejects negative durations through execution", () => {
    expect(
      runOxygenRequired({ durationMinutes: -10, flowLitersPerMinute: 6 }).ok,
    ).toBe(false);
  });
});
