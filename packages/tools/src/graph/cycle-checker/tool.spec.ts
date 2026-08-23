import { describe, expect, it } from "vitest";
import {
  calculateCycleChecker,
  cycleCheckerExample,
  runCycleChecker,
} from "./tool.js";

describe("graph/cycle-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCycleChecker(cycleCheckerExample.input)).toEqual({
      ok: true,
      output: cycleCheckerExample.output,
    });
  });

  it("accepts a directed acyclic graph", () => {
    const output = calculateCycleChecker({
      graph: { a: ["b"], b: [], c: ["b"] },
    });
    expect(output).toEqual({
      hasCycle: false,
      resolvedCount: 3,
      unresolvedNodes: [],
    });
  });

  it("detects self-loops", () => {
    const output = calculateCycleChecker({ graph: { a: ["a"], b: [] } });
    expect(output).toEqual({
      hasCycle: true,
      resolvedCount: 1,
      unresolvedNodes: ["a"],
    });
  });

  it("detects cycles hidden below zero-indegree entry points", () => {
    const output = calculateCycleChecker({
      graph: { entry: ["x"], x: ["y"], y: ["x"] },
    });
    expect(output.hasCycle).toBe(true);
    expect(output.resolvedCount).toBe(1);
    expect(output.unresolvedNodes).toEqual(["x", "y"]);
  });

  it("treats edges as directional", () => {
    const acyclicDirected = calculateCycleChecker({
      graph: { a: ["b"], b: ["c"], c: [] },
    });
    expect(acyclicDirected.hasCycle).toBe(false);
    const backReference = calculateCycleChecker({
      graph: { a: ["b"], b: ["a"], c: [] },
    });
    expect(backReference.hasCycle).toBe(true);
  });

  it("rejects an empty graph", () => {
    expect(runCycleChecker({ graph: {} })).toMatchObject({
      error: { issues: [{ code: "insufficient_nodes" }] },
      ok: false,
    });
  });
});
