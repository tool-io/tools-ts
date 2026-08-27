import { describe, expect, it } from "vitest";
import {
  brineSalinityPpmToPpgExample,
  runBrineSalinityPpmToPpg,
} from "./tool.js";

describe("brine-salinity-ppm-to-ppg", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBrineSalinityPpmToPpg(brineSalinityPpmToPpgExample.input),
    ).toEqual({
      ok: true,
      output: brineSalinityPpmToPpgExample.output,
    });
  });

  it("returns fresh-water weight for zero salinity", () => {
    const result = runBrineSalinityPpmToPpg({ salinityPpm: 0 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.specificGravity).toBe(1);
    expect(result.output.densityKgPerCubicMetre).toBe(1000);
    expect(result.output.mudWeightPpg).toBeCloseTo(8.35, 2);
  });

  it("rejects negative salinity", () => {
    expect(runBrineSalinityPpmToPpg({ salinityPpm: -1 }).ok).toBe(false);
  });
});
