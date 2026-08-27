import { describe, expect, it } from "vitest";
import { runRestrictionSiteCount } from "./tool.js";

describe("Restriction Site Count", () => {
  it("calculates a valid result", () =>
    expect(
      runRestrictionSiteCount({
        sequence: "GAATTCGGAATTC",
        site: "GAATTC",
      }),
    ).toEqual({ ok: true, output: { siteCount: 2 } }));
  it("returns zero without matches", () =>
    expect(
      runRestrictionSiteCount({ sequence: "GGCCGGCC", site: "GAATTC" }),
    ).toEqual({ ok: true, output: { siteCount: 0 } }));
  it("counts the whole sequence as one site", () =>
    expect(
      runRestrictionSiteCount({ sequence: "GAATTC", site: "GAATTC" }),
    ).toEqual({ ok: true, output: { siteCount: 1 } }));
  it("does not overlap matches", () =>
    expect(
      runRestrictionSiteCount({ sequence: "AAAAAA", site: "AAA" }),
    ).toEqual({ ok: true, output: { siteCount: 2 } }));
  it("returns zero for sites longer than the sequence", () =>
    expect(runRestrictionSiteCount({ sequence: "AT", site: "ATA" })).toEqual({
      ok: true,
      output: { siteCount: 0 },
    }));
  it("rejects an empty sequence", () => {
    const result = runRestrictionSiteCount({ sequence: "", site: "AATT" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects invalid recognition sites", () => {
    const result = runRestrictionSiteCount({
      sequence: "GAATTC",
      site: "GANTC",
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
