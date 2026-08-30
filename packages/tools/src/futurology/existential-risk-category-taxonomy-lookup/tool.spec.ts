import { describe, expect, it } from "vitest";
import {
  existentialRiskTaxonomyExample,
  lookupExistentialRiskCategory,
  runExistentialRiskTaxonomy,
} from "./tool.js";

describe("existential risk category taxonomy lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runExistentialRiskTaxonomy(existentialRiskTaxonomyExample.input),
    ).toEqual({
      ok: true,
      output: existentialRiskTaxonomyExample.output,
    });
  });

  it("looks up a deliberate category", () => {
    expect(
      lookupExistentialRiskCategory({ riskCategory: "deliberate" })
        .analysisQuestion,
    ).toContain("deliberate");
  });

  it("looks up an other category", () => {
    expect(
      lookupExistentialRiskCategory({ riskCategory: "other" })
        .taxonomyDefinition,
    ).toContain("not represented");
  });

  it("rejects an unsupported category at the public boundary", () => {
    expect(
      runExistentialRiskTaxonomy({ riskCategory: "geopolitical" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "riskCategory" }] },
      ok: false,
    });
  });
});
