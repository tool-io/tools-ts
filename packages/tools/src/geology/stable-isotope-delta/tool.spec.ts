import { describe, expect, it } from "vitest";
import { runStableIsotopeDelta, stableIsotopeDeltaExample } from "./tool.js";

describe("stable-isotope-delta", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStableIsotopeDelta(stableIsotopeDeltaExample.input)).toEqual({
      ok: true,
      output: stableIsotopeDeltaExample.output,
    });
  });

  it("returns zero for a sample matching the standard", () => {
    const result = runStableIsotopeDelta({
      ratioSample: 0.0020052,
      ratioStandard: 0.0020052,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.deltaPerMil as number).toBe(0);
  });

  it("rejects non-positive ratios", () => {
    expect(
      runStableIsotopeDelta({ ratioSample: -1, ratioStandard: 1 }).ok,
    ).toBe(false);
  });
});
