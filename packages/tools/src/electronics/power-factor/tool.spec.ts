import { describe, expect, it } from "vitest";
import { runPowerFactor } from "./tool.js";
describe("Power Factor Calculator", () => {
  it("calculates a valid result", () =>
    expect(runPowerFactor({ impedanceOhms: 5, resistanceOhms: 3 })).toEqual({
      ok: true,
      output: { powerFactor: 0.6 },
    }));
  it("calculates another value", () =>
    expect(runPowerFactor({ impedanceOhms: 5, resistanceOhms: 4 })).toEqual({
      ok: true,
      output: { powerFactor: 0.8 },
    }));
  it("rejects zero impedance", () => {
    const result = runPowerFactor({ impedanceOhms: 0, resistanceOhms: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "impedanceOhms",
      });
  });
  it("rejects negative impedance", () => {
    const result = runPowerFactor({ impedanceOhms: -5, resistanceOhms: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("impedanceOhms");
  });
  it("rejects non-finite input", () =>
    expect(
      runPowerFactor({
        impedanceOhms: Number.POSITIVE_INFINITY,
        resistanceOhms: 1,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runPowerFactor({
      impedanceOhms: 1,
      resistanceOhms: 2,
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
    expect(runPowerFactor({ resistanceOhms: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runPowerFactor({ impedanceOhms: 5, resistanceOhms: "3" }).ok).toBe(
      false,
    ));
});
