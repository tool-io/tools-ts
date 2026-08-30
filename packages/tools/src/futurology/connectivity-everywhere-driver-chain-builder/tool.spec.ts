import { describe, expect, it } from "vitest";
import {
  buildConnectivityEverywhereDriverChains,
  connectivityChainExample,
  runConnectivityChain,
} from "./tool.js";

describe("connectivity everywhere driver chain", () => {
  it("reproduces its canonical example", () => {
    expect(runConnectivityChain(connectivityChainExample.input)).toEqual({
      ok: true,
      output: connectivityChainExample.output,
    });
  });

  it("reports multiple roots and terminals", () => {
    expect(
      buildConnectivityEverywhereDriverChains({
        driverIds: ["A", "B", "C", "D"],
        nextDriverIndices: [-1, -1, 0, 1],
      }),
    ).toMatchObject({ rootCount: 2, terminalCount: 2 });
  });

  it("detects a cycle", () => {
    expect(
      buildConnectivityEverywhereDriverChains({
        driverIds: ["A", "B"],
        nextDriverIndices: [1, 0],
      }).cycleDetected,
    ).toBe(true);
  });

  it("rejects an invalid next index", () => {
    expect(
      runConnectivityChain({ driverIds: ["A"], nextDriverIndices: [3] }),
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
