import { describe, expect, it } from "vitest";
import {
  DIP_MINUTES_PER_SQRT_FOOT,
  horizonDipExample,
  runHorizonDip,
} from "./tool.js";

describe("Horizon Dip Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runHorizonDip(horizonDipExample.input)).toEqual({
      ok: true,
      output: { dipMinutesOfArc: 2.91 },
    });
  });

  it("returns the bare coefficient for a one foot height", () => {
    expect(runHorizonDip({ heightOfEyeFeet: 1 })).toEqual({
      ok: true,
      output: { dipMinutesOfArc: DIP_MINUTES_PER_SQRT_FOOT },
    });
  });

  it("handles perfect square heights exactly", () => {
    expect(runHorizonDip({ heightOfEyeFeet: 16 })).toEqual({
      ok: true,
      output: { dipMinutesOfArc: 3.88 },
    });
    expect(runHorizonDip({ heightOfEyeFeet: 25 })).toEqual({
      ok: true,
      output: { dipMinutesOfArc: 4.85 },
    });
  });

  it("grows with the square root for non-square heights", () => {
    const result = runHorizonDip({ heightOfEyeFeet: 60 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dipMinutesOfArc).toBeCloseTo(7.513587691642389, 10);
  });

  it("rejects zero height with a stable error", () => {
    expect(runHorizonDip({ heightOfEyeFeet: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "heightOfEyeFeet" }] },
      ok: false,
    });
  });

  it("rejects negative heights", () => {
    expect(runHorizonDip({ heightOfEyeFeet: -6 }).ok).toBe(false);
  });

  it("rejects non-finite heights", () => {
    expect(runHorizonDip({ heightOfEyeFeet: Number.NaN }).ok).toBe(false);
    expect(
      runHorizonDip({ heightOfEyeFeet: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () => {
    expect(
      runHorizonDip({ deckHeightFt: 4, heightOfEyeFeet: 9 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "deckHeightFt" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runHorizonDip(null).ok).toBe(false);
    expect(runHorizonDip({}).ok).toBe(false);
  });
});
