import { describe, expect, it } from "vitest";
import { runConductanceFromResistance } from "./tool.js";
describe("Conductance From R", () => {
  it("calculates a valid result", () =>
    expect(runConductanceFromResistance({ resistanceOhms: 200 })).toEqual({
      ok: true,
      output: { conductanceSiemens: 0.005 },
    }));
  it("calculates fractional resistance", () =>
    expect(runConductanceFromResistance({ resistanceOhms: 0.5 })).toEqual({
      ok: true,
      output: { conductanceSiemens: 2 },
    }));
  it("supports negative resistance", () =>
    expect(runConductanceFromResistance({ resistanceOhms: -100 })).toEqual({
      ok: true,
      output: { conductanceSiemens: -0.01 },
    }));
  it("rejects zero resistance with must_be_nonzero", () => {
    const result = runConductanceFromResistance({ resistanceOhms: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "must_be_nonzero",
        field: "resistanceOhms",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runConductanceFromResistance({ resistanceOhms: Number.NaN }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runConductanceFromResistance({
      resistanceOhms: 1,
      extra: 2,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runConductanceFromResistance({}).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runConductanceFromResistance({ resistanceOhms: "10" }).ok).toBe(
      false,
    ));
});
