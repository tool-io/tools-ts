import { describe, expect, it } from "vitest";
import {
  calculateEuvDoseToClear,
  euvDoseToClearExample,
  runEuvDoseToClear,
} from "./tool.js";

describe("EUV Photon Fluence to Dose Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEuvDoseToClear(euvDoseToClearExample.input)).toEqual({
      ok: true,
      output: euvDoseToClearExample.output,
    });
  });

  it("scales linearly with fluence and photon energy", () => {
    expect(
      calculateEuvDoseToClear({
        photonEnergyJoules: 2e-17,
        photonsPerUm2: 100,
      }),
    ).toEqual({ doseMJPerCm2: 0.0002 });
    expect(
      calculateEuvDoseToClear({
        photonEnergyJoules: 1.4725e-17,
        photonsPerUm2: 200,
      }).doseMJPerCm2,
    ).toBe(2 * euvDoseToClearExample.output.doseMJPerCm2);
  });

  it("accepts fractional expected fluence", () => {
    expect(
      runEuvDoseToClear({
        photonEnergyJoules: 1.4725e-17,
        photonsPerUm2: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { doseMJPerCm2: 7.362500000000001e-7 },
    });
  });

  it("recovers a finite result when direct multiplication underflows", () => {
    expect(
      calculateEuvDoseToClear({
        photonEnergyJoules: 1e-300,
        photonsPerUm2: 1e300,
      }),
    ).toEqual({ doseMJPerCm2: 1e11 });
  });

  it.each([
    ["photonEnergyJoules", { photonEnergyJoules: 0, photonsPerUm2: 100 }],
    ["photonsPerUm2", { photonEnergyJoules: 1e-17, photonsPerUm2: 0 }],
  ] as const)("rejects an invalid %s", (field, input) => {
    expect(() => calculateEuvDoseToClear(input)).toThrow();
    expect(runEuvDoseToClear(input)).toMatchObject({
      error: { issues: [{ field }] },
      ok: false,
    });
  });

  it("rejects non-finite, missing, and unknown inputs", () => {
    expect(
      runEuvDoseToClear({
        photonEnergyJoules: Number.NaN,
        photonsPerUm2: 100,
      }).ok,
    ).toBe(false);
    expect(runEuvDoseToClear({} as never).ok).toBe(false);
    expect(runEuvDoseToClear({ extra: 1 } as never)).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
  });
});
