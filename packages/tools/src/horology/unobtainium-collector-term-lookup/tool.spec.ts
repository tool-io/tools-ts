import { describe, expect, it } from "vitest";
import {
  collectorTermExample,
  lookupUnobtainiumCollectorTerm,
  runCollectorTerm,
} from "./tool.js";

describe("unobtainium collector-term lookup", () => {
  it("reproduces the canonical marketing-language caution", () => {
    expect(runCollectorTerm(collectorTermExample.input)).toEqual({
      ok: true,
      output: collectorTermExample.output,
    });
  });

  it("defines grail as subjective", () => {
    expect(
      lookupUnobtainiumCollectorTerm({ termFocus: "grail" }).verifiedMeaning,
    ).toContain("subjective");
  });

  it("defines unobtainium figuratively", () => {
    expect(
      lookupUnobtainiumCollectorTerm({ termFocus: "unobtainium" })
        .verifiedMeaning,
    ).toContain("figuratively");
  });

  it("keeps valuation separate from the label", () => {
    expect(
      lookupUnobtainiumCollectorTerm({ termFocus: "valuationCaution" })
        .verifiedMeaning,
    ).toContain("does not establish value");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runCollectorTerm({ termFocus: "tier" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "termFocus" }] },
      ok: false,
    });
  });
});
