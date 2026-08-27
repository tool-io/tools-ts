import { describe, expect, it } from "vitest";
import { runImpedancePhase } from "./tool.js";
describe("Impedance Phase", () => {
  it("calculates a valid result", () =>
    expect(runImpedancePhase({ reactanceOhms: 8, resistanceOhms: 8 })).toEqual({
      ok: true,
      output: { phaseDegrees: 45 },
    }));
  it("returns zero for pure resistance", () =>
    expect(runImpedancePhase({ reactanceOhms: 0, resistanceOhms: 5 })).toEqual({
      ok: true,
      output: { phaseDegrees: 0 },
    }));
  it("returns negative phase for capacitive reactance", () =>
    expect(
      runImpedancePhase({ reactanceOhms: -10, resistanceOhms: 10 }),
    ).toEqual({
      ok: true,
      output: { phaseDegrees: -45 },
    }));
  it("rejects zero resistance", () => {
    const result = runImpedancePhase({ reactanceOhms: 1, resistanceOhms: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "resistanceOhms",
      });
  });
  it("rejects negative resistance", () => {
    const result = runImpedancePhase({ reactanceOhms: 1, resistanceOhms: -5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("resistanceOhms");
  });
  it("rejects non-finite input", () =>
    expect(
      runImpedancePhase({
        reactanceOhms: Number.POSITIVE_INFINITY,
        resistanceOhms: 1,
      }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runImpedancePhase({
      reactanceOhms: 1,
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
    expect(runImpedancePhase({ reactanceOhms: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runImpedancePhase({ reactanceOhms: {}, resistanceOhms: 1 }).ok).toBe(
      false,
    ));
});
