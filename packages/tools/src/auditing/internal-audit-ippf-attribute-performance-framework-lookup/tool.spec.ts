import { describe, expect, it } from "vitest";
import {
  evaluateIppfAttributeEvidence,
  ippfAttributeExample,
  runIppfAttribute,
} from "./tool.js";

describe("IPPF attribute performance framework", () => {
  it("reproduces its canonical example", () => {
    expect(runIppfAttribute(ippfAttributeExample.input)).toEqual({
      ok: true,
      output: ippfAttributeExample.output,
    });
  });

  it("reports full conformity for conformant assessments", () => {
    expect(
      evaluateIppfAttributeEvidence({
        assessedPrinciples: ["A"],
        conformityResults: [1],
        requiredPrinciples: ["A"],
      }).conformityRatePercent,
    ).toBe(100);
  });

  it("normalizes principle labels without case sensitivity", () => {
    expect(
      evaluateIppfAttributeEvidence({
        assessedPrinciples: [" STANDARD 1 "],
        conformityResults: [1],
        requiredPrinciples: ["standard 1"],
      }).missingPrinciples,
    ).toEqual([]);
  });

  it("rejects mismatched principles and results", () => {
    expect(
      runIppfAttribute({
        assessedPrinciples: ["A"],
        conformityResults: [],
        requiredPrinciples: ["A"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "attribute_data_length_mismatch",
            field: "conformityResults",
          },
        ],
      },
      ok: false,
    });
  });
});
