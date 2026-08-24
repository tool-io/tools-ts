import { describe, expect, it } from "vitest";
import {
  beneventanZoneLocatorExample,
  runBeneventanZoneLocator,
} from "./tool.js";

describe("beneventan-zone-locator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBeneventanZoneLocator(beneventanZoneLocatorExample.input),
    ).toEqual({
      ok: true,
      output: beneventanZoneLocatorExample.output,
    });
  });

  it("marks an eleventh-century Dalmatian witness as floruit inside the zone", () => {
    const result = runBeneventanZoneLocator({
      century: 11,
      region: "dalmatian_coast",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.usagePhase as string).toBe("classic_floruit");
    expect(result.output.coreRegion as boolean).toBe(true);
  });

  it("flags elsewhere as outside the core region", () => {
    const result = runBeneventanZoneLocator({
      century: 11,
      region: "elsewhere",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.coreRegion as boolean).toBe(false);
  });

  it("rejects non-positive centuries", () => {
    expect(runBeneventanZoneLocator({ century: -3 }).ok).toBe(false);
  });
});
