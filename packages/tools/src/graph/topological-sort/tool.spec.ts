import { describe, expect, it } from "vitest";
import {
  calculateTopologicalSort,
  runTopologicalSort,
  topologicalSortExample,
} from "./tool.js";

describe("graph/topological-sort", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTopologicalSort(topologicalSortExample.input)).toEqual({
      ok: true,
      output: topologicalSortExample.output,
    });
  });

  it("emits the lexicographically smallest available node first", () => {
    const output = calculateTopologicalSort({
      graph: { b: ["d"], a: ["d"], d: [], c: [] },
    });
    expect(output.order).toEqual(["a", "b", "c", "d"]);
  });

  it("keeps every edge pointing from earlier to later nodes", () => {
    const output = calculateTopologicalSort({
      graph: { app: ["db", "web"], db: [], web: ["db"] },
    });
    const position = new Map(output.order.map((node, index) => [node, index]));
    for (const [source, targets] of [
      ["app", ["db", "web"]],
      ["web", ["db"]],
    ] as const)
      for (const target of targets)
        expect(position.get(source)!).toBeLessThan(position.get(target)!);
  });

  it("orders a linear chain deterministically", () => {
    const output = calculateTopologicalSort({
      graph: { c: ["d"], a: ["b"], b: ["c"], d: [] },
    });
    expect(output.order).toEqual(["a", "b", "c", "d"]);
  });

  it("rejects cyclic graphs", () => {
    expect(
      runTopologicalSort({ graph: { a: ["b"], b: ["c"], c: ["a"] } }),
    ).toMatchObject({
      error: { issues: [{ code: "cyclic_graph" }] },
      ok: false,
    });
  });

  it("rejects an empty graph", () => {
    expect(runTopologicalSort({ graph: {} })).toMatchObject({
      error: { issues: [{ code: "insufficient_nodes" }] },
      ok: false,
    });
  });
});
