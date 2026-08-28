import { describe, expect, it } from "vitest";
import { runInductiveSusceptance } from "./tool.js";
describe("Inductive Susceptance", () => {
  it("calculates a valid result", () =>
    expect(
      runInductiveSusceptance({ frequencyHz: 50, inductanceH: 0.1 }),
    ).toEqual({
      ok: true,
      output: { susceptanceSiemens: -0.03183098861837907 },
    }));
  it("calculates another value", () =>
    expect(
      runInductiveSusceptance({ frequencyHz: 1000, inductanceH: 0.001 }),
    ).toEqual({
      ok: true,
      output: { susceptanceSiemens: -0.15915494309189535 },
    }));
  it("always returns a negative value", () => {
    const result = runInductiveSusceptance({
      frequencyHz: 60,
      inductanceH: 0.01,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.susceptanceSiemens).toBeLessThan(0);
  });
  it("rejects zero frequency", () => {
    const result = runInductiveSusceptance({
      frequencyHz: 0,
      inductanceH: 0.1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "frequencyHz",
      });
  });
  it("rejects zero inductance", () => {
    const result = runInductiveSusceptance({
      frequencyHz: 50,
      inductanceH: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "inductanceH",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runInductiveSusceptance({
        frequencyHz: Number.NaN,
        inductanceH: 0.1,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runInductiveSusceptance({
      frequencyHz: 50,
      inductanceH: 1,
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
    expect(runInductiveSusceptance({ inductanceH: 1 }).ok).toBe(false));
});
