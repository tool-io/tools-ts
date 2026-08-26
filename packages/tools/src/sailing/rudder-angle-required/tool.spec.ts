import { describe, expect, it } from "vitest";
import { rudderAngleRequiredExample, runRudderAngleRequired } from "./tool.js";

describe("rudder correction angle calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRudderAngleRequired(rudderAngleRequiredExample.input)).toEqual({
      ok: true,
      output: rudderAngleRequiredExample.output,
    });
  });

  it("returns zero correction for zero drift at the drift boundary", () => {
    expect(
      runRudderAngleRequired({ forwardSpeedMs: 5, lateralDriftMs: 0 }),
    ).toEqual({ ok: true, output: { correctionAngleDegrees: 0 } });
  });

  it("supports fractional speeds", () => {
    const result = runRudderAngleRequired({
      forwardSpeedMs: 2.5,
      lateralDriftMs: 2.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctionAngleDegrees).toBeCloseTo(45, 12);
  });

  it("rejects zero forward speed with invalid_input", () => {
    expect(
      runRudderAngleRequired({ forwardSpeedMs: 0, lateralDriftMs: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "forwardSpeedMs" }] },
      ok: false,
    });
  });

  it("rejects negative forward speed through validation", () => {
    expect(
      runRudderAngleRequired({ forwardSpeedMs: -1, lateralDriftMs: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "forwardSpeedMs" }] },
      ok: false,
    });
  });

  it("rejects negative drift through validation", () => {
    expect(
      runRudderAngleRequired({ forwardSpeedMs: 5, lateralDriftMs: -0.1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "lateralDriftMs" }] },
      ok: false,
    });
  });

  it("rejects missing and malformed inputs", () => {
    expect(runRudderAngleRequired({}).ok).toBe(false);
    expect(
      runRudderAngleRequired({ forwardSpeedMs: "fast", lateralDriftMs: 1 }).ok,
    ).toBe(false);
    expect(
      runRudderAngleRequired({ forwardSpeedMs: 5, lateralDriftMs: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
