import { describe, expect, it } from "vitest";
import {
  lookupWatchBrandTaxonomy,
  runWatchBrandTaxonomy,
  watchBrandTaxonomyExample,
} from "./tool.js";

describe("watch-brand ownership and production-scale taxonomy lookup", () => {
  it("reproduces the canonical microbrand market-term example", () => {
    expect(runWatchBrandTaxonomy(watchBrandTaxonomyExample.input)).toEqual({
      ok: true,
      output: watchBrandTaxonomyExample.output,
    });
  });

  it("separates independent ownership from production scale", () => {
    expect(
      lookupWatchBrandTaxonomy({ taxonomyFocus: "independentOwnership" })
        .verifiedStatement,
    ).toContain("does not by itself imply small scale");
  });

  it("defines conglomerate control", () => {
    expect(
      lookupWatchBrandTaxonomy({ taxonomyFocus: "conglomerateControl" })
        .verifiedStatement,
    ).toContain("larger group owns or controls");
  });

  it("requires evidence for manufacture depth", () => {
    expect(
      lookupWatchBrandTaxonomy({ taxonomyFocus: "manufactureDepth" })
        .verifiedStatement,
    ).toContain("documented partners");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runWatchBrandTaxonomy({ taxonomyFocus: "luxury" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "taxonomyFocus" }] },
      ok: false,
    });
  });
});
