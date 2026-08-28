import { describe, expect, it } from "vitest";
import { runSeriesResonantImpedance } from "./tool.js";

const firstIssueCode = (
  result: ReturnType<typeof runSeriesResonantImpedance>,
) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};

describe("Series Resonance Impedance", () => {
  it("equals the winding resistance for an 8 ohm coil", () =>
    expect(runSeriesResonantImpedance({ windingResistanceOhms: 8 })).toEqual({
      ok: true,
      output: { impedanceAtResonanceOhms: 8 },
    }));
  it("equals the winding resistance for a large inductor", () =>
    expect(runSeriesResonantImpedance({ windingResistanceOhms: 1200 })).toEqual(
      {
        ok: true,
        output: { impedanceAtResonanceOhms: 1200 },
      },
    ));
  it("preserves fractional winding resistances exactly", () =>
    expect(runSeriesResonantImpedance({ windingResistanceOhms: 0.25 })).toEqual(
      {
        ok: true,
        output: { impedanceAtResonanceOhms: 0.25 },
      },
    ));
  it("rejects a zero winding resistance", () => {
    const result = runSeriesResonantImpedance({ windingResistanceOhms: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative winding resistance", () =>
    expect(runSeriesResonantImpedance({ windingResistanceOhms: -8 }).ok).toBe(
      false,
    ));
  it("rejects non-finite winding resistance", () =>
    expect(
      runSeriesResonantImpedance({ windingResistanceOhms: Number.NaN }).ok,
    ).toBe(false));
});
