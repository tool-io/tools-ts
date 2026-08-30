import { describe, expect, it } from "vitest";
import {
  lookupMilPrf46374Specification,
  milPrf46374Example,
  runMilPrf46374,
} from "./tool.js";

describe("MIL-PRF-46374 field-watch specification lookup", () => {
  it("reproduces the canonical active DLA document", () => {
    expect(runMilPrf46374(milPrf46374Example.input)).toEqual({
      ok: true,
      output: milPrf46374Example.output,
    });
  });

  it("distinguishes the historical MIL-W name", () => {
    expect(
      lookupMilPrf46374Specification({ specificationFocus: "historicalName" })
        .verifiedStatement,
    ).toContain("MIL-W-46374");
  });

  it("preserves the low- or no-light scope", () => {
    expect(
      lookupMilPrf46374Specification({ specificationFocus: "lowLightUse" })
        .verifiedStatement,
    ).toContain("more than eight hours");
  });

  it("requires revision and model evidence", () => {
    expect(
      lookupMilPrf46374Specification({ specificationFocus: "seriesCaution" })
        .verifiedStatement,
    ).toContain("revision, type, class");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runMilPrf46374({ specificationFocus: "maker" })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "specificationFocus" }],
      },
      ok: false,
    });
  });
});
