import { describe, expect, it } from "vitest";
import {
  calculateNormalizeEdgeList,
  normalizeEdgeListExample,
  runNormalizeEdgeList,
} from "./tool.js";

describe("graph edge list normalizer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNormalizeEdgeList(normalizeEdgeListExample.input)).toEqual({
      ok: true,
      output: normalizeEdgeListExample.output,
    });
  });

  it("preserves direction and deduplicates when directed", () => {
    expect(
      calculateNormalizeEdgeList({
        directed: true,
        graph: { a: ["b", "b"], b: [] },
      }),
    ).toEqual({
      table: {
        directed: true,
        edges: [["a", "b"]],
        nodes: ["a", "b"],
      },
    });
  });

  it("adopts neighbor names as nodes even without their own keys", () => {
    expect(
      calculateNormalizeEdgeList({ directed: false, graph: { a: ["z"] } }),
    ).toEqual({
      table: {
        directed: false,
        edges: [["a", "z"]],
        nodes: ["a", "z"],
      },
    });
  });

  it("rejects malformed graphs through execution", () => {
    expect(runNormalizeEdgeList({ graph: "nope" }).ok).toBe(false);
    for (const graph of [{ a: "b" }, { a: [1] }])
      expect(runNormalizeEdgeList({ graph })).toMatchObject({
        error: { issues: [{ code: "invalid_graph" }] },
        ok: false,
      });
  });
});
