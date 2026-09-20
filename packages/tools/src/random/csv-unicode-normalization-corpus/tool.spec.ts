import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCsvUnicodeNormalizationCorpus,
} from "./index.js";
import { lightweightModelTests } from "../m500b-csv-algorithms-testing.js";
describe("CSV Unicode normalization", () => {
  it("lightweight discloses inherited empty-field and blank-record conversion", () => {
    const dropped = tool.execute({
      headers: ["h"],
      rows: [[""]],
      forms: ["NFC"],
      seed: 42,
    });
    if (!dropped.ok) throw new Error("Expected empty-cell control");
    expect(dropped.output.rows).toEqual([[""]]);
    expect(dropped.output.parsedJson).toBe("[]");
    expect(dropped.output.conversionConvention).toContain(
      "empty cells become null",
    );
    const retained = tool.execute({
      headers: ["h", "keep"],
      rows: [["", "x"]],
      forms: ["NFC"],
      seed: 42,
    });
    if (!retained.ok) throw new Error("Expected mixed-cell control");
    expect(JSON.parse(retained.output.parsedJson)).toEqual([
      { h: null, keep: "x" },
    ]);
  });
  lightweightModelTests(tool, calculateCsvUnicodeNormalizationCorpus, example);
  it("lightweight distinguishes compatibility conversion from canonical equivalence", () => {
    const result = tool.execute(
      { headers: ["label"], rows: [["ﬁ"]], forms: ["NFKC"] },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected compatibility normalization");
    expect(result.output.rows).toEqual([["fi"]]);
    expect(result.output.comparisons[1]).toMatchObject({
      originalBytes: [239, 172, 129],
      normalizedBytes: [102, 105],
      canonicalEquivalent: false,
      byteEqual: false,
    });
  });
  it("lightweight rejects normalized header collisions", () => {
    expect(
      tool.execute({
        headers: ["é", "e\u0301"],
        rows: [["a", "b"]],
        forms: ["NFC"],
        seed: 42,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "headers", code: "duplicate_entries" }] },
    });
  });
});
