import { describe, expect, it } from "vitest";
import { overburdenGradientExample, runOverburdenGradient } from "./tool.js";

describe("overburden-gradient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runOverburdenGradient(overburdenGradientExample.input)).toEqual({
      ok: true,
      output: overburdenGradientExample.output,
    });
  });

  it("matches the lithostatic water-loaded limit for unit density", () => {
    const result = runOverburdenGradient({
      averageBulkDensityKgPerCubicMetre: 1000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.overburdenStressGradientPaPerMetre).toBeCloseTo(
      9806.65,
      6,
    );
  });

  it("rejects non-positive densities", () => {
    expect(
      runOverburdenGradient({ averageBulkDensityKgPerCubicMetre: -5 }).ok,
    ).toBe(false);
  });
});
