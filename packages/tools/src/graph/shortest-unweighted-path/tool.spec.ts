import { describe, expect, it } from "vitest";
import {
  shortestUnweightedPathExample,
  runShortestUnweightedPath,
} from "./tool.js";

describe("graph/shortest-unweighted-path", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runShortestUnweightedPath(shortestUnweightedPathExample.input),
    ).toEqual({ ok: true, output: shortestUnweightedPathExample.output });
  });

  it("finds a distance-0 path to itself and reports unreachable targets", () => {
    const self = runShortestUnweightedPath({
      graph: { a: ["b"], b: [] },
      source: "a",
      target: "a",
    });
    expect(self.ok && self.output.distance === 0).toBe(true);
    const unreachable = runShortestUnweightedPath({
      directed: true,
      graph: { a: ["b"], b: [], c: ["b"] },
      source: "a",
      target: "c",
    });
    expect(unreachable).toEqual({
      ok: true,
      output: { distance: -1, found: false, path: [] },
    });
  });

  it("rejects unknown endpoints with structured errors", () => {
    const missingSource = runShortestUnweightedPath({
      graph: { a: ["b"], b: [] },
      source: "z",
      target: "b",
    });
    expect(missingSource.ok).toBe(false);
    if (!missingSource.ok)
      expect(missingSource.error.issues[0]?.code).toBe("unknown_node");
    const missingTarget = runShortestUnweightedPath({
      graph: { a: ["b"], b: [] },
      source: "a",
      target: "q",
    });
    expect(missingTarget.ok).toBe(false);
    if (!missingTarget.ok)
      expect(missingTarget.error.issues[0]?.code).toBe("unknown_node");
  });
});
