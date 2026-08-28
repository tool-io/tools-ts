import { describe, expect, it } from "vitest";
import {
  calculateSolenoidForce,
  runSolenoidForce,
  solenoidForceExample,
} from "./tool.js";

describe("Solenoid Force N", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSolenoidForce(solenoidForceExample.input)).toEqual({
      ok: true,
      output: solenoidForceExample.output,
    });
  });

  it("quadruples force when current doubles", () => {
    const base = calculateSolenoidForce({
      crossSectionAreaM2: 0.001,
      currentAmps: 1,
      gapMeters: 0.001,
      turnsInt: 100,
    }).solenoidForceNewtons;
    const doubled = calculateSolenoidForce({
      crossSectionAreaM2: 0.001,
      currentAmps: 2,
      gapMeters: 0.001,
      turnsInt: 100,
    }).solenoidForceNewtons;
    expect(doubled).toBe(base * 4);
  });

  it("quadruples force when the gap halves", () => {
    const wide = calculateSolenoidForce({
      crossSectionAreaM2: 0.001,
      currentAmps: 1.5,
      gapMeters: 0.004,
      turnsInt: 200,
    }).solenoidForceNewtons;
    const narrow = calculateSolenoidForce({
      crossSectionAreaM2: 0.001,
      currentAmps: 1.5,
      gapMeters: 0.002,
      turnsInt: 200,
    }).solenoidForceNewtons;
    expect(narrow).toBe(wide * 4);
  });

  it("rejects zero current via invalid_current", () => {
    expect(
      runSolenoidForce({
        crossSectionAreaM2: 0.001,
        currentAmps: 0,
        gapMeters: 0.001,
        turnsInt: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "currentAmps" }] },
      ok: false,
    });
  });

  it("rejects a zero turn count via invalid_turns", () => {
    expect(
      runSolenoidForce({
        crossSectionAreaM2: 0.001,
        currentAmps: 1,
        gapMeters: 0.001,
        turnsInt: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "turnsInt" }] },
      ok: false,
    });
  });

  it("rejects a non-integer turn count via invalid_turns", () => {
    expect(() =>
      calculateSolenoidForce({
        crossSectionAreaM2: 0.001,
        currentAmps: 1,
        gapMeters: 0.001,
        turnsInt: 10.5,
      }),
    ).toThrow();
  });

  it("rejects zero gap via invalid_gap", () => {
    expect(
      runSolenoidForce({
        crossSectionAreaM2: 0.001,
        currentAmps: 1,
        gapMeters: 0,
        turnsInt: 100,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_gap", field: "gapMeters" }] },
      ok: false,
    });
  });

  it("rejects zero area via invalid_area", () => {
    expect(
      runSolenoidForce({
        crossSectionAreaM2: 0,
        currentAmps: 1,
        gapMeters: 0.001,
        turnsInt: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_area", field: "crossSectionAreaM2" }],
      },
      ok: false,
    });
  });
});
