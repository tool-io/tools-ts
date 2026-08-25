import { describe, expect, it } from "vitest";
import {
  calculateVgmVerifiedGrossMassSolasTotal,
  vgmVerifiedGrossMassSolasTotalExample,
  runVgmVerifiedGrossMassSolasTotal,
} from "./tool.js";

describe("vgm-verified-gross-mass-solas-total", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVgmVerifiedGrossMassSolasTotal(
        vgmVerifiedGrossMassSolasTotalExample.input,
      ),
    ).toEqual({
      ok: true,
      output: vgmVerifiedGrossMassSolasTotalExample.output,
    });
  });

  it("sums cargo and tare when no packing is declared", () => {
    const result = runVgmVerifiedGrossMassSolasTotal({
      cargoMassKg: 12000.5,
      containerTareMassKg: 3900,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verifiedGrossMassKg as number).toBe(15900.5);
  });
  it("rejects non-positive tare masses", () => {
    expect(
      runVgmVerifiedGrossMassSolasTotal({
        cargoMassKg: 1000,
        containerTareMassKg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and overflowing masses", () => {
    expect(() =>
      calculateVgmVerifiedGrossMassSolasTotal({
        cargoMassKg: Number.NaN,
        containerTareMassKg: 100,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateVgmVerifiedGrossMassSolasTotal({
        cargoMassKg: Number.MAX_VALUE,
        containerTareMassKg: Number.MAX_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
