import { describe, expect, it } from "vitest";
import { runAdmittanceMagnitude } from "./tool.js";
describe("Admittance Magnitude", () => {
  it("calculates a valid result", () =>
    expect(
      runAdmittanceMagnitude({ conductanceS: 3, susceptanceS: 4 }),
    ).toEqual({
      ok: true,
      output: { admittanceSiemens: 5 },
    }));
  it("calculates a pythagorean triple", () =>
    expect(
      runAdmittanceMagnitude({ conductanceS: 5, susceptanceS: 12 }),
    ).toEqual({
      ok: true,
      output: { admittanceSiemens: 13 },
    }));
  it("allows zero inputs", () =>
    expect(
      runAdmittanceMagnitude({ conductanceS: 0, susceptanceS: 0 }),
    ).toEqual({
      ok: true,
      output: { admittanceSiemens: 0 },
    }));
  it("handles negative susceptance", () =>
    expect(
      runAdmittanceMagnitude({ conductanceS: 3, susceptanceS: -4 }).ok,
    ).toBe(true));
  it("rejects non-finite input", () =>
    expect(
      runAdmittanceMagnitude({
        conductanceS: Number.POSITIVE_INFINITY,
        susceptanceS: 1,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runAdmittanceMagnitude({
      conductanceS: 1,
      susceptanceS: 2,
      extra: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runAdmittanceMagnitude({ conductanceS: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(
      runAdmittanceMagnitude({ conductanceS: "1", susceptanceS: 2 }).ok,
    ).toBe(false));
});
