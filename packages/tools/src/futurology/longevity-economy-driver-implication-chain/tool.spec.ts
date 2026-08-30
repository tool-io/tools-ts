import { describe, expect, it } from "vitest";
import {
  buildLongevityEconomyDriverChains,
  longevityChainExample,
  runLongevityChain,
} from "./tool.js";

describe("longevity economy driver implication chain", () => {
  it("reproduces its canonical example", () => {
    expect(runLongevityChain(longevityChainExample.input)).toEqual({
      ok: true,
      output: longevityChainExample.output,
    });
  });

  it("builds separate chains", () => {
    expect(
      buildLongevityEconomyDriverChains({
        driverIds: ["A", "B", "C"],
        nextDriverIndices: [1, -1, -1],
      }),
    ).toMatchObject({ chainCount: 2, chains: ["A -> B", "C"] });
  });

  it("detects a cycle", () => {
    expect(
      buildLongevityEconomyDriverChains({
        driverIds: ["A", "B"],
        nextDriverIndices: [1, 0],
      }).cycleDetected,
    ).toBe(true);
  });

  it("rejects a mismatched next-index list", () => {
    expect(
      runLongevityChain({ driverIds: ["A"], nextDriverIndices: [] }),
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
