import { describe, expect, it } from "vitest";
import { runLd50 } from "./tool.js";

describe("LD50 Log-Dose Interpolation", () => {
  it("calculates a valid result", () =>
    expect(
      runLd50({
        doseHigh: 100,
        doseLow: 10,
        responseHighFraction: 0.75,
        responseLowFraction: 0.25,
      }),
    ).toEqual({ ok: true, output: { estimatedLd50: 31.622776601683793 } }));
  it("returns the lower dose at its own half-response anchor", () =>
    expect(
      runLd50({
        doseHigh: 100,
        doseLow: 10,
        responseHighFraction: 0.75,
        responseLowFraction: 0.5,
      }),
    ).toEqual({ ok: true, output: { estimatedLd50: 10 } }));
  it("returns the higher dose at its own half-response anchor", () =>
    expect(
      runLd50({
        doseHigh: 100,
        doseLow: 10,
        responseHighFraction: 0.5,
        responseLowFraction: 0.25,
      }),
    ).toEqual({ ok: true, output: { estimatedLd50: 100 } }));
  it("rejects response points that do not bracket half mortality", () =>
    expect(
      runLd50({
        doseHigh: 100,
        doseLow: 10,
        responseHighFraction: 0.4,
        responseLowFraction: 0.2,
      }).ok,
    ).toBe(false));
  it("rejects equal doses", () =>
    expect(
      runLd50({
        doseHigh: 50,
        doseLow: 50,
        responseHighFraction: 0.9,
        responseLowFraction: 0.1,
      }).ok,
    ).toBe(false));
  it("rejects non-positive doses", () => {
    const result = runLd50({
      doseHigh: 100,
      doseLow: -1,
      responseHighFraction: 0.75,
      responseLowFraction: 0.25,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_dose");
  });
  it("rejects degenerate equal responses", () => {
    const result = runLd50({
      doseHigh: 100,
      doseLow: 10,
      responseHighFraction: 0.6,
      responseLowFraction: 0.6,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_response_order");
  });
  it("rejects responses outside zero to one", () =>
    expect(
      runLd50({
        doseHigh: 100,
        doseLow: 10,
        responseHighFraction: 1.5,
        responseLowFraction: 0.25,
      }).ok,
    ).toBe(false));
});
