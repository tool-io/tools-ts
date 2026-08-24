import { describe, expect, it } from "vitest";
import {
  calculateCrossDockFlowThroughRatePercent,
  crossDockFlowThroughRatePercentExample,
  runCrossDockFlowThroughRatePercent,
} from "./tool.js";

describe("cross-dock-flow-through-rate-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCrossDockFlowThroughRatePercent(
        crossDockFlowThroughRatePercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: crossDockFlowThroughRatePercentExample.output,
    });
  });

  it("handles fractional rates", () => {
    expect(
      runCrossDockFlowThroughRatePercent({
        flowThroughUnits: 1,
        totalUnitsReceived: 3,
      }),
    ).toEqual({ ok: true, output: { flowThroughPercent: 33.33333333333333 } });
  });

  it("rejects zero total units received", () => {
    const result = runCrossDockFlowThroughRatePercent({
      flowThroughUnits: 10,
      totalUnitsReceived: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_field",
      field: "totalUnitsReceived",
    });
  });

  it("rejects invalid counts and flow-through units above receipts", () => {
    expect(() =>
      calculateCrossDockFlowThroughRatePercent({
        flowThroughUnits: 1.5,
        totalUnitsReceived: 10,
      }),
    ).toThrow("safe integer");
    expect(() =>
      calculateCrossDockFlowThroughRatePercent({
        flowThroughUnits: 11,
        totalUnitsReceived: 10,
      }),
    ).toThrow("no greater than");
  });
});
