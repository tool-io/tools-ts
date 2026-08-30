import { describe, expect, it } from "vitest";
import {
  inspectionDeficiencyCategoryExample,
  mapInspectionDeficiencyCategories,
  runInspectionDeficiencyCategory,
} from "./tool.js";

describe("inspection deficiency category cross-reference", () => {
  it("reproduces its canonical example", () => {
    expect(
      runInspectionDeficiencyCategory(
        inspectionDeficiencyCategoryExample.input,
      ),
    ).toEqual({
      ok: true,
      output: inspectionDeficiencyCategoryExample.output,
    });
  });

  it("normalizes category labels without case sensitivity", () => {
    expect(
      mapInspectionDeficiencyCategories({
        observedCategories: [" AUDIT EXECUTION "],
        requiredCategories: ["audit execution"],
        uncategorizedFindings: 0,
      }).categorizationComplete,
    ).toBe(true);
  });

  it("reports missing and unknown categories together", () => {
    expect(
      mapInspectionDeficiencyCategories({
        observedCategories: ["Other"],
        requiredCategories: ["Audit Execution"],
        uncategorizedFindings: 1,
      }),
    ).toEqual({
      categorizationComplete: false,
      missingCategories: ["audit execution"],
      unknownCategories: ["other"],
    });
  });

  it("rejects a negative uncategorized count", () => {
    expect(
      runInspectionDeficiencyCategory({
        observedCategories: [],
        requiredCategories: [],
        uncategorizedFindings: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "uncategorizedFindings",
          },
        ],
      },
      ok: false,
    });
  });
});
