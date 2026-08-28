import { describe, expect, it } from "vitest";
import {
  calculateLedLuminousEfficacy,
  ledLuminousEfficacyExample,
  runLedLuminousEfficacy,
} from "./tool.js";

describe("LED Efficacy", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLedLuminousEfficacy(ledLuminousEfficacyExample.input)).toEqual({
      ok: true,
      output: ledLuminousEfficacyExample.output,
    });
  });

  it("doubles efficacy when flux doubles at fixed power", () => {
    const base = calculateLedLuminousEfficacy({
      luminousFluxLm: 300,
      powerWatts: 6,
    }).efficacyLumensPerWatt;
    expect(
      calculateLedLuminousEfficacy({
        luminousFluxLm: 600,
        powerWatts: 6,
      }).efficacyLumensPerWatt,
    ).toBe(base * 2);
  });

  it("halves efficacy when power doubles at fixed flux", () => {
    const base = calculateLedLuminousEfficacy({
      luminousFluxLm: 900,
      powerWatts: 5,
    }).efficacyLumensPerWatt;
    expect(
      calculateLedLuminousEfficacy({
        luminousFluxLm: 900,
        powerWatts: 10,
      }).efficacyLumensPerWatt,
    ).toBe(base / 2);
  });

  it("reports zero efficacy for zero flux", () => {
    expect(
      runLedLuminousEfficacy({ luminousFluxLm: 0, powerWatts: 3 }),
    ).toEqual({ ok: true, output: { efficacyLumensPerWatt: 0 } });
  });

  it("rejects zero power with a stable code", () => {
    expect(
      runLedLuminousEfficacy({ luminousFluxLm: 100, powerWatts: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "powerWatts" }] },
      ok: false,
    });
  });

  it("rejects negative flux with a stable code", () => {
    expect(
      runLedLuminousEfficacy({ luminousFluxLm: -1, powerWatts: 3 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_flux", field: "luminousFluxLm" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runLedLuminousEfficacy({
        ...ledLuminousEfficacyExample.input,
        watts: 2,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "watts" }] },
      ok: false,
    });
  });
});
