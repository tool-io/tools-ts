import { describe, expect, it } from "vitest";
import {
  runUrbanizationDriverGraph,
  traceUrbanizationDriverGraph,
  urbanizationDriverGraphExample,
} from "./tool.js";

describe("urbanization driver implication graph", () => {
  it("reproduces its canonical example", () => {
    expect(
      runUrbanizationDriverGraph(urbanizationDriverGraphExample.input),
    ).toEqual({
      ok: true,
      output: urbanizationDriverGraphExample.output,
    });
  });

  it("reports drivers unreachable from the root", () => {
    expect(
      traceUrbanizationDriverGraph({
        driverIds: ["Root", "A", "Isolated"],
        links: [
          [0, 1, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        rootDriverId: "Root",
      }),
    ).toMatchObject({
      disconnectedDriverIds: ["Isolated"],
      reachableCount: 2,
      rootReachesAllDrivers: false,
    });
  });

  it("keeps a self-rooted driver reachable", () => {
    expect(
      traceUrbanizationDriverGraph({
        driverIds: ["Only"],
        links: [[1]],
        rootDriverId: "Only",
      }).reachableCount,
    ).toBe(1);
  });

  it("rejects an unknown root driver", () => {
    expect(
      runUrbanizationDriverGraph({
        driverIds: ["A"],
        links: [[0]],
        rootDriverId: "B",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_root_driver", field: "rootDriverId" }],
      },
      ok: false,
    });
  });
});
