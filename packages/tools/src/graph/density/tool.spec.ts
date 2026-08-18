import { describe, expect, it } from "vitest";
import { calculateDensity, densityExample, runDensity } from "./tool.js";

describe("graph density calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDensity(densityExample.input)).toEqual({
      ok: true,
      output: densityExample.output,
    });
  });

  it("halves the count for undirected complete graphs", () => {
    const triangle = calculateDensity({
      directed: false,
      graph: { a: ["b"], b: ["c"], c: ["a"] },
    });
    expect(triangle.density).toBe(1);
    const directedTriangle = calculateDensity({
      directed: true,
      graph: { a: ["b"], b: ["c"], c: ["a"] },
    });
    expect(directedTriangle.density).toBe(0.5);
  });

  it("ignores self-loops and rejects tiny graphs through execution", () => {
    expect(
      calculateDensity({ directed: false, graph: { a: ["a"], b: [] } })
        .density,
    ).toBe(0);
    expect(runDensity({ directed: false, graph: { a: ["a"] } })).toMatchObject(
      {
        error: { issues: [{ code: "insufficient_nodes" }] },
        ok: false,
      },
    );
  });
});
