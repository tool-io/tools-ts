import { describe, expect, it } from "vitest";
import { calculateDegrees, degreesExample, runDegrees } from "./tool.js";

describe("graph degree calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDegrees(degreesExample.input)).toEqual({
      ok: true,
      output: degreesExample.output,
    });
  });

  it("counts directed in and out degrees separately", () => {
    const output = calculateDegrees({
      directed: true,
      graph: { a: ["b"], b: ["c"], c: ["a"] },
    });
    expect(output.table).toEqual({
      degree: [2, 2, 2],
      inDegree: [1, 1, 1],
      nodes: ["a", "b", "c"],
      outDegree: [1, 1, 1],
    });
  });

  it("adds two for undirected self-loops", () => {
    const output = calculateDegrees({ directed: false, graph: { a: ["a"] } });
    expect(output.table.degree).toEqual([2]);
    expect(output.table.inDegree).toEqual([2]);
  });
});
