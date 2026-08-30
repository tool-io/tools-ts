import { describe, expect, it } from "vitest";
import {
  buildDriverImplicationChains,
  driverChainExample,
  runDriverChain,
} from "./tool.js";

describe("aging population driver implication chain", () => {
  it("reproduces its canonical example", () => {
    expect(runDriverChain(driverChainExample.input)).toEqual({
      ok: true,
      output: driverChainExample.output,
    });
  });

  it("builds multiple roots into one terminal", () => {
    expect(
      buildDriverImplicationChains({
        driverIds: ["A", "B", "C"],
        nextDriverIndices: [2, 2, -1],
      }),
    ).toMatchObject({
      chains: ["A -> C", "B -> C"],
      terminalCount: 1,
    });
  });

  it("detects a cycle", () => {
    expect(
      buildDriverImplicationChains({
        driverIds: ["A", "B"],
        nextDriverIndices: [1, 0],
      }).cycleDetected,
    ).toBe(true);
  });

  it("rejects an out-of-range next index", () => {
    expect(
      runDriverChain({ driverIds: ["A"], nextDriverIndices: [2] }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_next_driver_index", field: "nextDriverIndices.0" },
        ],
      },
      ok: false,
    });
  });
});
