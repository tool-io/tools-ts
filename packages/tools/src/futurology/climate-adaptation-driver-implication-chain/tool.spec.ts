import { describe, expect, it } from "vitest";
import {
  buildClimateAdaptationDriverChains,
  climateAdaptationChainExample,
  runClimateAdaptationChain,
} from "./tool.js";

describe("climate adaptation driver implication chain", () => {
  it("reproduces its canonical example", () => {
    expect(
      runClimateAdaptationChain(climateAdaptationChainExample.input),
    ).toEqual({
      ok: true,
      output: climateAdaptationChainExample.output,
    });
  });

  it("builds multiple chains with a shared terminal", () => {
    expect(
      buildClimateAdaptationDriverChains({
        driverIds: ["A", "B", "Outcome"],
        nextDriverIndices: [2, 2, -1],
      }),
    ).toEqual({
      chains: ["A -> Outcome", "B -> Outcome"],
      cycleDetected: false,
      terminalDriverIds: ["Outcome"],
    });
  });

  it("detects a driver cycle", () => {
    expect(
      buildClimateAdaptationDriverChains({
        driverIds: ["A", "B"],
        nextDriverIndices: [1, 0],
      }).cycleDetected,
    ).toBe(true);
  });

  it("rejects duplicate driver IDs", () => {
    expect(
      runClimateAdaptationChain({
        driverIds: ["A", "A"],
        nextDriverIndices: [-1, -1],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "duplicate_driver_id", field: "driverIds" }] },
      ok: false,
    });
  });
});
