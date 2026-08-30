import { describe, expect, it } from "vitest";
import {
  arCoatingExample,
  lookupSapphireArCoatingSide,
  runArCoating,
} from "./tool.js";

describe("sapphire AR coating side lookup", () => {
  it("reproduces the canonical ISO 14368-4 standard", () => {
    expect(runArCoating(arCoatingExample.input)).toEqual({
      ok: true,
      output: arCoatingExample.output,
    });
  });

  it("describes single-side treatment", () => {
    expect(
      lookupSapphireArCoatingSide({ coatingFocus: "singleSide" })
        .verifiedStatement,
    ).toContain("one face only");
  });

  it("describes double-side treatment", () => {
    expect(
      lookupSapphireArCoatingSide({ coatingFocus: "doubleSide" })
        .verifiedStatement,
    ).toContain("both crystal faces");
  });

  it("keeps residual reflection and tint possible", () => {
    expect(
      lookupSapphireArCoatingSide({ coatingFocus: "opticalEffect" })
        .verifiedStatement,
    ).toContain("residual reflection");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runArCoating({ coatingFocus: "scratch" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "coatingFocus" }] },
      ok: false,
    });
  });
});
