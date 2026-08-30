import { describe, expect, it } from "vitest";
import {
  buildEnergyTransitionDriverChains,
  energyTransitionChainExample,
  runEnergyTransitionChain,
} from "./tool.js";

describe("energy transition driver implication chain", () => {
  it("reproduces its canonical example", () => {
    expect(
      runEnergyTransitionChain(energyTransitionChainExample.input),
    ).toEqual({
      ok: true,
      output: energyTransitionChainExample.output,
    });
  });

  it("builds paths from two roots", () => {
    expect(
      buildEnergyTransitionDriverChains({
        driverIds: ["A", "B", "C"],
        nextDriverIndices: [1, 2, -1],
      }).chains,
    ).toEqual(["A -> B -> C"]);
  });

  it("detects a cycle", () => {
    expect(
      buildEnergyTransitionDriverChains({
        driverIds: ["A", "B"],
        nextDriverIndices: [1, 0],
      }).cycleDetected,
    ).toBe(true);
  });

  it("rejects mismatched driver and next-index counts", () => {
    expect(
      runEnergyTransitionChain({
        driverIds: ["A"],
        nextDriverIndices: [-1, -1],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "driver_data_length_mismatch", field: "nextDriverIndices" },
        ],
      },
      ok: false,
    });
  });
});
