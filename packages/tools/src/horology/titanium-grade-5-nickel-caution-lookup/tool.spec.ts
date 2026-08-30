import { describe, expect, it } from "vitest";
import {
  lookupTitaniumGrade5NickelCaution,
  runTitaniumCaution,
  titaniumCautionExample,
} from "./tool.js";

describe("Titanium Grade 5 nickel caution lookup", () => {
  it("reproduces the canonical ASTM Grade 5 identity", () => {
    expect(runTitaniumCaution(titaniumCautionExample.input)).toEqual({
      ok: true,
      output: titaniumCautionExample.output,
    });
  });

  it("keeps bulk composition separate from nickel release", () => {
    expect(
      lookupTitaniumGrade5NickelCaution({ cautionFocus: "releaseMeasurement" })
        .verifiedStatement,
    ).toContain("not a substitute");
  });

  it("distinguishes nickel-bearing Grade 25", () => {
    expect(
      lookupTitaniumGrade5NickelCaution({ cautionFocus: "nickelAddition" })
        .verifiedStatement,
    ).toContain("Grade 25");
  });

  it("avoids an individual allergy guarantee", () => {
    expect(
      lookupTitaniumGrade5NickelCaution({ cautionFocus: "allergyCaution" })
        .verifiedStatement,
    ).toContain("does not guarantee");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runTitaniumCaution({ cautionFocus: "weight" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "cautionFocus" }] },
      ok: false,
    });
  });
});
