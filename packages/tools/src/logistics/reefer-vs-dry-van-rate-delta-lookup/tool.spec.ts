import { describe, expect, it } from "vitest";
import {
  reeferVsDryVanRateDeltaLookupExample,
  runReeferVsDryVanRateDeltaLookup,
} from "./tool.js";

describe("reefer-vs-dry-van-rate-delta-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReeferVsDryVanRateDeltaLookup(
        reeferVsDryVanRateDeltaLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: reeferVsDryVanRateDeltaLookupExample.output,
    });
  });

  it("reports negative premiums when reefers are cheap", () => {
    expect(
      runReeferVsDryVanRateDeltaLookup({
        dryVanRatePerMileUsd: 3,
        reeferRatePerMileUsd: 2.7,
      }),
    ).toEqual({
      ok: true,
      output: {
        premiumPercentOverDryVan: -9.999999999999993,
        premiumPerMileUsd: -0.2999999999999998,
      },
    });
  });

  it("rejects a zero dry van benchmark", () => {
    expect(
      runReeferVsDryVanRateDeltaLookup({
        dryVanRatePerMileUsd: 0,
        reeferRatePerMileUsd: 2,
      }).ok,
    ).toBe(false);
  });
});
