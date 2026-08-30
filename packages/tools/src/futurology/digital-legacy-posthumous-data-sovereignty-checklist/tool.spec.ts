import { describe, expect, it } from "vitest";
import {
  buildDigitalLegacySovereigntyChecklist,
  digitalLegacyChecklistExample,
  runDigitalLegacyChecklist,
} from "./tool.js";

describe("digital legacy posthumous data sovereignty checklist", () => {
  it("reproduces its canonical example", () => {
    expect(
      runDigitalLegacyChecklist(digitalLegacyChecklistExample.input),
    ).toEqual({
      ok: true,
      output: digitalLegacyChecklistExample.output,
    });
  });

  it("reports an incomplete checklist without an executor", () => {
    expect(
      buildDigitalLegacySovereigntyChecklist({
        controlAreas: [
          "access",
          "deletion",
          "portability",
          "consent",
          "executor",
        ],
        dataSubjectCount: 1,
        executorDesignated: false,
        retentionYears: 1,
      }).complete,
    ).toBe(false);
  });

  it("deduplicates control areas", () => {
    expect(
      buildDigitalLegacySovereigntyChecklist({
        controlAreas: ["access", "access"],
        dataSubjectCount: 0,
        executorDesignated: false,
        retentionYears: 0,
      }).controlAreaCount,
    ).toBe(1);
  });

  it("rejects a negative data subject count", () => {
    expect(
      runDigitalLegacyChecklist({
        controlAreas: [],
        dataSubjectCount: -1,
        executorDesignated: true,
        retentionYears: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "dataSubjectCount" }],
      },
      ok: false,
    });
  });
});
