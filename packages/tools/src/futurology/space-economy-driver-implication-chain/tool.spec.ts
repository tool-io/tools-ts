import { describe, expect, it } from "vitest";
import {
  buildSpaceEconomyDriverChains,
  runSpaceEconomyChain,
  spaceEconomyChainExample,
} from "./tool.js";

describe("space economy driver implication chain", () => {
  it("reproduces its canonical example", () => {
    expect(runSpaceEconomyChain(spaceEconomyChainExample.input)).toEqual({
      ok: true,
      output: spaceEconomyChainExample.output,
    });
  });

  it("finds the longest branch", () => {
    expect(
      buildSpaceEconomyDriverChains({
        driverIds: ["A", "B", "C", "D"],
        nextDriverIndices: [1, 2, 3, -1],
      }).maximumChainLength,
    ).toBe(4);
  });

  it("detects a cycle", () => {
    expect(
      buildSpaceEconomyDriverChains({
        driverIds: ["A", "B"],
        nextDriverIndices: [1, 0],
      }).cycleDetected,
    ).toBe(true);
  });

  it("rejects duplicate driver IDs", () => {
    expect(
      runSpaceEconomyChain({
        driverIds: ["A", "A"],
        nextDriverIndices: [-1, -1],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "duplicate_driver_id", field: "driverIds" }] },
      ok: false,
    });
  });
});
