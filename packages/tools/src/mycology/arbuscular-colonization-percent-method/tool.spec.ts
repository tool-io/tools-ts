import { describe, expect, it } from "vitest";
import {
  arbuscularColonizationPercentMethodExample,
  runArbuscularColonizationPercentMethod,
} from "./tool.js";

describe("AM Colonization %", () => {
  it("matches the canonical example", () =>
    expect(
      runArbuscularColonizationPercentMethod(
        arbuscularColonizationPercentMethodExample.input,
      ),
    ).toEqual({
      ok: true,
      output: arbuscularColonizationPercentMethodExample.output,
    }));
  it("yields zero when no segments are colonized", () =>
    expect(
      runArbuscularColonizationPercentMethod({
        colonizedSegmentsInt: 0,
        totalSegmentsInt: 80,
      }),
    ).toEqual({ ok: true, output: { colonizationPercent: 0 } }));
  it("yields one hundred when every segment is colonized", () =>
    expect(
      runArbuscularColonizationPercentMethod({
        colonizedSegmentsInt: 80,
        totalSegmentsInt: 80,
      }),
    ).toEqual({ ok: true, output: { colonizationPercent: 100 } }));
  it("computes fractional percentages", () =>
    expect(
      runArbuscularColonizationPercentMethod({
        colonizedSegmentsInt: 1,
        totalSegmentsInt: 3,
      }).ok,
    ).toBe(true));
  it("matches one third within tolerance", () =>
    expect(
      runArbuscularColonizationPercentMethod({
        colonizedSegmentsInt: 1,
        totalSegmentsInt: 3,
      }),
    ).toEqual({
      ok: true,
      output: { colonizationPercent: (1 / 3) * 100 },
    }));
  it("rejects colonized counts above the total", () => {
    const result = runArbuscularColonizationPercentMethod({
      colonizedSegmentsInt: 81,
      totalSegmentsInt: 80,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_segments");
  });
  it("rejects a zero total segment count", () =>
    expect(
      runArbuscularColonizationPercentMethod({
        colonizedSegmentsInt: 0,
        totalSegmentsInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects fractional segment counts", () =>
    expect(
      runArbuscularColonizationPercentMethod({
        colonizedSegmentsInt: 1.5,
        totalSegmentsInt: 10,
      }).ok,
    ).toBe(false));
});
