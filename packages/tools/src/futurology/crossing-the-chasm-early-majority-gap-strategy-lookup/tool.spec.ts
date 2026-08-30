import { describe, expect, it } from "vitest";
import {
  crossingTheChasmExample,
  lookupEarlyMajorityGapStrategy,
  runCrossingTheChasm,
} from "./tool.js";

describe("crossing the chasm gap strategy lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runCrossingTheChasm(crossingTheChasmExample.input)).toEqual({
      ok: true,
      output: crossingTheChasmExample.output,
    });
  });

  it("looks up a credibility strategy", () => {
    expect(
      lookupEarlyMajorityGapStrategy({ gapType: "credibility" }),
    ).toMatchObject({ gapType: "credibility" });
  });

  it("looks up an affordability strategy", () => {
    expect(
      lookupEarlyMajorityGapStrategy({ gapType: "affordability" }),
    ).toMatchObject({ gapType: "affordability" });
  });

  it("rejects an unsupported gap type at the public boundary", () => {
    expect(runCrossingTheChasm({ gapType: "network" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "gapType" }] },
      ok: false,
    });
  });
});
