import { describe, expect, it } from "vitest";
import { runThreeSatInstance, threeSatInstanceExample } from "./tool.js";

describe("3SAT instance", () => {
  it("publishes an executable example", () => {
    expect(runThreeSatInstance(threeSatInstanceExample.input)).toEqual({
      ok: true,
      output: threeSatInstanceExample.output,
    });
  });
  it("uses three distinct variables in every clause", () => {
    const result = runThreeSatInstance(threeSatInstanceExample.input);
    expect(
      result.ok &&
        (result.output.instance as { clauses: number[][] }).clauses.every(
          (clause) => new Set(clause.map(Math.abs)).size === 3,
        ),
    ).toBe(true);
  });
});
