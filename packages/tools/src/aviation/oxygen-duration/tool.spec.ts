import { describe, expect, it } from "vitest";
import {
  calculateOxygenDuration,
  oxygenDurationExample,
  runOxygenDuration,
} from "./tool.js";

describe("oxygen duration calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOxygenDuration(oxygenDurationExample.input)).toEqual({
      ok: true,
      output: { durationHours: 100 / 60 },
    });
  });

  it("halves duration when flow doubles", () => {
    const baseResult = runOxygenDuration({
      flowLitersPerMinute: 6,
      usableOxygenLiters: 600,
    });
    const doubledResult = runOxygenDuration({
      flowLitersPerMinute: 12,
      usableOxygenLiters: 600,
    });
    if (!baseResult.ok || !doubledResult.ok)
      throw new Error("expected success");
    const base = baseResult.output.durationHours as number;
    const doubled = doubledResult.output.durationHours as number;
    expect(doubled).toBeCloseTo(base / 2, 12);
  });

  it("rejects zero flow through execution", () => {
    expect(
      runOxygenDuration({ flowLitersPerMinute: 0, usableOxygenLiters: 600 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_flow" }] },
      ok: false,
    });
  });
});
