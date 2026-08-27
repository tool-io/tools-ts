import { describe, expect, it } from "vitest";
import { runTherapeuticIndex } from "./tool.js";

describe("Therapeutic Index", () => {
  it("calculates a valid result", () =>
    expect(runTherapeuticIndex({ ed50Dose: 50, td50Dose: 500 })).toEqual({
      ok: true,
      output: { therapeuticIndex: 10 },
    }));
  it("reports one for identical doses", () =>
    expect(runTherapeuticIndex({ ed50Dose: 5, td50Dose: 5 })).toEqual({
      ok: true,
      output: { therapeuticIndex: 1 },
    }));
  it("supports fractional ratios", () =>
    expect(runTherapeuticIndex({ ed50Dose: 8, td50Dose: 30 })).toEqual({
      ok: true,
      output: { therapeuticIndex: 3.75 },
    }));
  it("grows with wide safety margins", () =>
    expect(runTherapeuticIndex({ ed50Dose: 30, td50Dose: 900 })).toEqual({
      ok: true,
      output: { therapeuticIndex: 30 },
    }));
  it("handles decimal doses", () =>
    expect(runTherapeuticIndex({ ed50Dose: 0.25, td50Dose: 2 })).toEqual({
      ok: true,
      output: { therapeuticIndex: 8 },
    }));
  it("rejects non-positive ED50", () => {
    const result = runTherapeuticIndex({ ed50Dose: 0, td50Dose: 500 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_dose");
  });
  it("rejects negative TD50", () => {
    const result = runTherapeuticIndex({ ed50Dose: 50, td50Dose: -500 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_dose");
  });
});
