import { describe, expect, it } from "vitest";
import {
  goldenNumberCyclePositionExample,
  runGoldenNumberCyclePosition,
} from "./tool.js";

describe("golden-number-cycle-position", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGoldenNumberCyclePosition(goldenNumberCyclePositionExample.input),
    ).toEqual({ ok: true, output: goldenNumberCyclePositionExample.output });
  });

  it("restarts the cycle on years congruent to zero mod 19", () => {
    const result = runGoldenNumberCyclePosition({ year: 2033 });
    expect(result).toEqual({
      ok: true,
      output: { goldenNumber: 1, metonicPhase: 0, yearsToCycleRestart: 19 },
    });
  });

  it("rejects a non-positive year", () => {
    expect(runGoldenNumberCyclePosition({ year: 0 }).ok).toBe(false);
  });
});
