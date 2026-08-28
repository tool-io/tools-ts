import { describe, expect, it } from "vitest";
import { runCapacitiveSusceptance } from "./tool.js";
describe("Capacitive Susceptance", () => {
  it("calculates a valid result", () =>
    expect(
      runCapacitiveSusceptance({ capacitanceF: 0.00001, frequencyHz: 50 }),
    ).toEqual({
      ok: true,
      output: { susceptanceSiemens: 0.0031415926535897933 },
    }));
  it("scales with frequency", () =>
    expect(
      runCapacitiveSusceptance({ capacitanceF: 1e-9, frequencyHz: 1000 }),
    ).toEqual({
      ok: true,
      output: { susceptanceSiemens: 0.000006283185307179586 },
    }));
  it("rejects zero frequency", () => {
    const result = runCapacitiveSusceptance({
      capacitanceF: 0.000001,
      frequencyHz: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "frequencyHz",
      });
  });
  it("rejects negative capacitance", () => {
    const result = runCapacitiveSusceptance({
      capacitanceF: -1,
      frequencyHz: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "capacitanceF",
      });
  });
  it("rejects non-finite input", () =>
    expect(
      runCapacitiveSusceptance({
        capacitanceF: Number.POSITIVE_INFINITY,
        frequencyHz: 50,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runCapacitiveSusceptance({
      capacitanceF: 1,
      frequencyHz: 2,
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
    expect(runCapacitiveSusceptance({ frequencyHz: 50 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(
      runCapacitiveSusceptance({ capacitanceF: true, frequencyHz: 50 }).ok,
    ).toBe(false));
});
