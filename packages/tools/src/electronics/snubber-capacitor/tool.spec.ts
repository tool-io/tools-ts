import { describe, expect, it } from "vitest";
import { runSnubberCapacitor, snubberCapacitorExample } from "./tool.js";
describe("Snubber Capacitor Value", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSnubberCapacitor(snubberCapacitorExample.input)).toEqual({
      ok: true,
      output: snubberCapacitorExample.output,
    });
  });
  it("scales capacitance with current and turn-off time", () => {
    expect(
      runSnubberCapacitor({
        switchCurrentA: 2,
        turnOffTimeNs: 100,
        voltageSpikeVolts: 200,
      }),
    ).toEqual({ ok: true, output: { snubberCapacitanceNf: 1 } });
  });
  it("rejects invalid input", () => {
    expect(
      runSnubberCapacitor({
        switchCurrentA: 1,
        turnOffTimeNs: 0,
        voltageSpikeVolts: 100,
      }).ok,
    ).toBe(false);
  });
});
