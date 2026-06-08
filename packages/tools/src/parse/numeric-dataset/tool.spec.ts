import { describe, expect, it } from "vitest";
import fixtures from "../../../../../fixtures/numeric-dataset.json" with {
  type: "json",
};
import {
  normalizeNumericDataset,
  numericDatasetParserTool,
  parseFiniteNumberList,
  parseNumericDataset,
} from "./tool.js";

describe("numeric dataset parser", () => {
  it("matches the portable conformance fixtures", () => {
    for (const fixture of fixtures) {
      const result = parseNumericDataset(fixture.input);
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

  it("preserves string-adapter behavior", () => {
    expect(normalizeNumericDataset("1, 2, 3")).toBe("1,2,3");
    expect(normalizeNumericDataset("1,,3")).toBe("");
    expect(normalizeNumericDataset("1,,3", "ignore")).toBe("1,3");
    expect(parseFiniteNumberList("1,,3")).toEqual([1, 3]);
    expect(parseFiniteNumberList("invalid")).toBeNull();
  });

  it("publishes chainable semantic ports", () => {
    expect(numericDatasetParserTool).toMatchObject({
      executionKind: "pure",
      id: "parse/numeric-dataset",
      ports: {
        outputs: [
          { id: "values", type: "dataset/number" },
          { id: "normalized", type: "text/plain" },
        ],
      },
    });
  });
});
