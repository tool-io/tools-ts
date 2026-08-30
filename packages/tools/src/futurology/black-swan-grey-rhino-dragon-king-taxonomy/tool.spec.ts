import { describe, expect, it } from "vitest";
import {
  eventRiskTaxonomyExample,
  lookupEventRiskTaxonomy,
  runEventRiskTaxonomy,
} from "./tool.js";

describe("black swan, grey rhino, and dragon-king taxonomy", () => {
  it("reproduces its canonical example", () => {
    expect(runEventRiskTaxonomy(eventRiskTaxonomyExample.input)).toEqual({
      ok: true,
      output: eventRiskTaxonomyExample.output,
    });
  });

  it("distinguishes a dragon king by its generating mechanism", () => {
    expect(
      lookupEventRiskTaxonomy({ category: "dragonKing" }).distinguishingFeature,
    ).toContain("generating mechanism");
  });

  it("rejects an unsupported category", () => {
    expect(runEventRiskTaxonomy({ category: "compoundRisk" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "category" }] },
      ok: false,
    });
  });
});
