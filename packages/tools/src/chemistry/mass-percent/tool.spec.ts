import { describe, expect, it } from "vitest";
import { runMassPercent, massPercentExample } from "./tool.js";

describe("Mass Percent Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMassPercent(massPercentExample.input)).toEqual({
      ok: true,
      output: massPercentExample.output,
    });
  });

  it("computes one hundred percent for identical masses", () => {
    expect(runMassPercent({ massComponentG: 10, massSolutionG: 10 })).toEqual({
      ok: true,
      output: { massPercent: 100 },
    });
  });

  it("computes a small percentage for dilute solutions", () => {
    expect(runMassPercent({ massComponentG: 1, massSolutionG: 200 })).toEqual({
      ok: true,
      output: { massPercent: 0.5 },
    });
  });

  it("rejects a component heavier than the solution", () => {
    const result = runMassPercent({
      massComponentG: 50,
      massSolutionG: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a zero solution mass", () => {
    const result = runMassPercent({ massComponentG: 5, massSolutionG: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("rejects a negative component mass", () => {
    const result = runMassPercent({
      massComponentG: -5,
      massSolutionG: 40,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });

  it("requires both masses", () => {
    expect(runMassPercent({ massComponentG: 5 }).ok).toBe(false);
    expect(runMassPercent({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMassPercent([5, 40]).ok).toBe(false);
  });
});
