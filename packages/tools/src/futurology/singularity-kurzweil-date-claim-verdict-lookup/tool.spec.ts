import { describe, expect, it } from "vitest";
import {
  assessKurzweilDateClaim,
  runSingularityDateClaim,
  singularityDateClaimExample,
} from "./tool.js";

describe("singularity date claim verdict lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runSingularityDateClaim(singularityDateClaimExample.input)).toEqual({
      ok: true,
      output: singularityDateClaimExample.output,
    });
  });

  it("reports weak evidence for one citation", () => {
    expect(
      assessKurzweilDateClaim({
        citationCount: 1,
        claimedYear: 2050,
        primarySourceCount: 0,
      }),
    ).toMatchObject({ evidenceStrength: "weak", verdict: "weaklySupported" });
  });

  it("reports insufficient evidence with no citations", () => {
    expect(
      assessKurzweilDateClaim({
        citationCount: 0,
        claimedYear: 2050,
        primarySourceCount: 0,
      }),
    ).toMatchObject({
      evidenceStrength: "insufficient",
      verdict: "notEstablished",
    });
  });

  it("rejects more primary sources than citations", () => {
    expect(
      runSingularityDateClaim({
        citationCount: 1,
        claimedYear: 2050,
        primarySourceCount: 2,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "citation_counts_inconsistent", field: "primarySourceCount" },
        ],
      },
      ok: false,
    });
  });
});
