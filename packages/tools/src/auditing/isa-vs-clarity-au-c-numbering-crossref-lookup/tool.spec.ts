import { describe, expect, it } from "vitest";
import {
  crossReferenceAuditNumbering,
  numberingCrossReferenceExample,
  runNumberingCrossReference,
} from "./tool.js";

describe("audit standard numbering cross-reference", () => {
  it("reproduces its canonical example", () => {
    expect(
      runNumberingCrossReference(numberingCrossReferenceExample.input),
    ).toEqual({
      ok: true,
      output: numberingCrossReferenceExample.output,
    });
  });

  it("accepts an exact unique cross-reference", () => {
    expect(
      crossReferenceAuditNumbering({
        expectedPrefixes: ["ISA", "AU-C"],
        reportedPrefixes: ["au-c", "ISA"],
      }).complete,
    ).toBe(true);
  });

  it("reports every missing expected prefix", () => {
    expect(
      crossReferenceAuditNumbering({
        expectedPrefixes: ["A", "B", "C"],
        reportedPrefixes: ["A"],
      }).missingPrefixes,
    ).toEqual(["b", "c"]);
  });

  it("rejects an empty expected prefix set", () => {
    expect(
      runNumberingCrossReference({
        expectedPrefixes: [],
        reportedPrefixes: [],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "expected_prefixes_required", field: "expectedPrefixes" },
        ],
      },
      ok: false,
    });
  });
});
