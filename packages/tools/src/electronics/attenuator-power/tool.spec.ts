import { describe, expect, it } from "vitest";
import {
  attenuatorPowerExample,
  calculateAttenuatorPower,
  runAttenuatorPower,
} from "./tool.js";

describe("Power Attenuator dB", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAttenuatorPower(attenuatorPowerExample.input)).toEqual({
      ok: true,
      output: attenuatorPowerExample.output,
    });
  });

  it("reports three decibels of loss at half power", () => {
    expect(calculateAttenuatorPower({ pIn: 2, pOut: 1 }).attenuationDb).toBe(
      -3.010299956639812,
    );
  });

  it("reports unity gain as zero decibels", () => {
    expect(runAttenuatorPower({ pIn: 0.75, pOut: 0.75 })).toEqual({
      ok: true,
      output: { attenuationDb: 0 },
    });
  });

  it("reports thirty decibels of loss for a thousandth of the power", () => {
    expect(
      calculateAttenuatorPower({ pIn: 1, pOut: 0.001 }).attenuationDb,
    ).toBe(-30);
  });

  it("turns positive for an amplifier instead of an attenuator", () => {
    expect(calculateAttenuatorPower({ pIn: 1, pOut: 2 }).attenuationDb).toBe(
      3.010299956639812,
    );
  });

  it("rejects zero input power with a stable code", () => {
    expect(runAttenuatorPower({ pIn: 0, pOut: 0.5 })).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "pIn" }] },
      ok: false,
    });
  });

  it("rejects zero output power with a stable code", () => {
    expect(runAttenuatorPower({ pIn: 1, pOut: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "pOut" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runAttenuatorPower({ ...attenuatorPowerExample.input, db: 1 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "db" }] },
      ok: false,
    });
  });
});
