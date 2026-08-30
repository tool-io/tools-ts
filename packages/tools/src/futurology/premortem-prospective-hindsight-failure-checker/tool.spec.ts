import { describe, expect, it } from "vitest";
import {
  checkProspectiveHindsightFailureCoverage,
  premortemExample,
  runPremortem,
} from "./tool.js";

describe("premortem prospective hindsight failure checker", () => {
  it("reproduces its canonical example", () => {
    expect(runPremortem(premortemExample.input)).toEqual({
      ok: true,
      output: premortemExample.output,
    });
  });

  it("reports a failure mode without a mitigation", () => {
    expect(
      checkProspectiveHindsightFailureCoverage({
        failureModes: ["A", "B"],
        mitigations: ["A|mitigation"],
        warningSignals: ["A|signal", "B|signal"],
      }).uncoveredFailureModes,
    ).toEqual(["B"]);
  });

  it("counts fully reviewed failure modes", () => {
    expect(
      checkProspectiveHindsightFailureCoverage({
        failureModes: ["A"],
        mitigations: ["A|mitigation"],
        warningSignals: [],
      }).fullyReviewedFailureCount,
    ).toBe(0);
  });

  it("rejects a malformed linked warning signal", () => {
    expect(
      runPremortem({
        failureModes: ["A"],
        mitigations: [],
        warningSignals: ["missing separator"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_linked_entry" }] },
      ok: false,
    });
  });
});
