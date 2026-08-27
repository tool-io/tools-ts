import { describe, expect, it } from "vitest";
import { runApparentPower } from "./tool.js";
describe("Apparent Power VA", () => {
  it("calculates a valid result", () =>
    expect(runApparentPower({ ampsRms: 0.5, voltsRms: 120 })).toEqual({
      ok: true,
      output: { apparentPowerVa: 60 },
    }));
  it("calculates another value", () =>
    expect(runApparentPower({ ampsRms: 2, voltsRms: 230 })).toEqual({
      ok: true,
      output: { apparentPowerVa: 460 },
    }));
  it("allows zero inputs", () =>
    expect(runApparentPower({ ampsRms: 0, voltsRms: 0 })).toEqual({
      ok: true,
      output: { apparentPowerVa: 0 },
    }));
  it("rejects negative voltage", () => {
    const result = runApparentPower({ ampsRms: 1, voltsRms: -120 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "voltsRms",
      });
  });
  it("rejects negative current", () => {
    const result = runApparentPower({ ampsRms: -1, voltsRms: 120 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "ampsRms",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runApparentPower({ ampsRms: Number.POSITIVE_INFINITY, voltsRms: 1 }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runApparentPower({ ampsRms: 1, voltsRms: 2, extra: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runApparentPower({ voltsRms: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runApparentPower({ ampsRms: "1", voltsRms: 2 }).ok).toBe(false));
});
