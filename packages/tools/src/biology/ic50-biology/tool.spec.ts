import { describe, expect, it } from "vitest";
import { runIc50Biology } from "./tool.js";

describe("IC50 Inhibition Conc", () => {
  it("calculates a valid result", () =>
    expect(
      runIc50Biology({
        concentration: 5,
        inhibitionFraction: 0.75,
        slope: 1,
      }),
    ).toEqual({ ok: true, output: { ic50Concentration: 1.6666666666666665 } }));
  it("returns the concentration itself at half inhibition", () =>
    expect(
      runIc50Biology({
        concentration: 7,
        inhibitionFraction: 0.5,
        slope: 1,
      }),
    ).toEqual({ ok: true, output: { ic50Concentration: 7 } }));
  it("defaults the slope to one", () =>
    expect(
      runIc50Biology({ concentration: 10, inhibitionFraction: 0.9 }),
    ).toEqual({
      ok: true,
      output: { ic50Concentration: 1.1111111111111107 },
    }));
  it("softens strong inhibition with slope two", () =>
    expect(
      runIc50Biology({
        concentration: 5,
        inhibitionFraction: 0.75,
        slope: 2,
      }),
    ).toEqual({ ok: true, output: { ic50Concentration: 2.8867513459481287 } }));
  it("scales linearly with the measured concentration", () =>
    expect(
      runIc50Biology({
        concentration: 2,
        inhibitionFraction: 0.2,
        slope: 1,
      }),
    ).toEqual({ ok: true, output: { ic50Concentration: 8 } }));
  it("rejects non-positive concentrations", () => {
    const result = runIc50Biology({
      concentration: -3,
      inhibitionFraction: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_concentration");
  });
  it("rejects inhibition fractions of one", () => {
    const result = runIc50Biology({
      concentration: 5,
      inhibitionFraction: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_inhibition");
  });
  it("rejects negative slopes", () => {
    const result = runIc50Biology({
      concentration: 5,
      inhibitionFraction: 0.75,
      slope: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_slope");
  });
});
