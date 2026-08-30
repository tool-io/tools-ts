import { describe, expect, it } from "vitest";
import {
  fixodropExample,
  lookupFixodropEpilameTreatment,
  runFixodrop,
} from "./tool.js";

describe("Fixodrop epilame surface-treatment lookup", () => {
  it("reproduces the canonical film-role statement", () => {
    expect(runFixodrop(fixodropExample.input)).toEqual({
      ok: true,
      output: fixodropExample.output,
    });
  });

  it("distinguishes epilame from lubricant", () => {
    expect(
      lookupFixodropEpilameTreatment({ treatmentFocus: "filmRole" })
        .verifiedStatement,
    ).toContain("not the lubricant");
  });

  it("requires cleaning and drying", () => {
    expect(
      lookupFixodropEpilameTreatment({ treatmentFocus: "cleaning" })
        .verifiedStatement,
    ).toContain("cleaned and dried");
  });

  it("identifies the published 8981 product status", () => {
    expect(
      lookupFixodropEpilameTreatment({ treatmentFocus: "product8981" })
        .verifiedStatement,
    ).toContain("several washes");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runFixodrop({ treatmentFocus: "quantity" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "treatmentFocus" }] },
      ok: false,
    });
  });
});
