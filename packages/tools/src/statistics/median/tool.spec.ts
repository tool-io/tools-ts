import { describe, expect, it } from "vitest";
import fixtures from "../../../../../fixtures/median.json" with { type: "json" };
import { calculateMedian, medianExample, medianTool } from "./tool.js";

describe("median", () => {
  it("matches the portable conformance fixtures", () => {
    for (const fixture of fixtures) {
      const result = calculateMedian(fixture.input);
      if ("output" in fixture) {
        expect(result).toEqual({ ok: true, output: fixture.output });
      } else {
        expect(result).toMatchObject({
          error: { code: fixture.error },
          ok: false,
        });
      }
    }
  });

  it("does not mutate a structured input dataset", () => {
    const values = [5, 1, 3];
    expect(calculateMedian({ values })).toEqual({
      ok: true,
      output: { median: 3 },
    });
    expect(values).toEqual([5, 1, 3]);
  });

  it("publishes an executable example", () => {
    expect(calculateMedian(medianExample.input)).toEqual({
      ok: true,
      output: { median: 3 },
    });
  });

  it("accepts the parser output port directly", () => {
    expect(medianTool.ports?.inputs[0]).toMatchObject({
      id: "values",
      valueType: { items: { type: "number" }, type: "list" },
    });
  });
});
