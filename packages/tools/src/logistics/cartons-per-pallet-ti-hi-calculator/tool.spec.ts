import { describe, expect, it } from "vitest";
import {
  calculateCartonsPerPalletTiHiCalculator,
  cartonsPerPalletTiHiCalculatorExample,
  runCartonsPerPalletTiHiCalculator,
} from "./tool.js";

describe("cartons-per-pallet-ti-hi-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCartonsPerPalletTiHiCalculator(
        cartonsPerPalletTiHiCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: cartonsPerPalletTiHiCalculatorExample.output,
    });
  });

  it("uses the rotated grid when it packs more cartons per layer", () => {
    const result = runCartonsPerPalletTiHiCalculator({
      palletDeckLengthCm: 120,
      palletDeckWidthCm: 100,
      usableStackHeightCm: 60,
      cartonLengthCm: 70,
      cartonWidthCm: 40,
      cartonHeightCm: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.chosenOrientation).toBe(
      "cartonLengthAlongPalletWidth",
    );
    expect(result.output.tiCartonsPerLayer).toBe(3);
    expect(result.output.totalCartonsPerPallet).toBe(9);
  });

  it("uses the unrotated orientation when both grids tie", () => {
    expect(
      calculateCartonsPerPalletTiHiCalculator({
        palletDeckLengthCm: 100,
        palletDeckWidthCm: 100,
        usableStackHeightCm: 20,
        cartonLengthCm: 50,
        cartonWidthCm: 25,
        cartonHeightCm: 10,
      }),
    ).toEqual({
      chosenOrientation: "cartonLengthAlongPalletLength",
      hiLayers: 2,
      tiCartonsPerLayer: 8,
      totalCartonsPerPallet: 16,
    });
  });

  it.each([
    {
      cartonLengthCm: 130,
      cartonWidthCm: 110,
      cartonHeightCm: 25,
      usableStackHeightCm: 180,
    },
    {
      cartonLengthCm: 40,
      cartonWidthCm: 30,
      cartonHeightCm: 25,
      usableStackHeightCm: 10,
    },
  ])("rejects a carton that cannot fit", (carton) => {
    const result = runCartonsPerPalletTiHiCalculator({
      palletDeckLengthCm: 120,
      palletDeckWidthCm: 100,
      ...carton,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]?.code).toBe("no_fit");
  });

  it("rejects invalid dimensions and unsafe calculated counts", () => {
    expect(() =>
      calculateCartonsPerPalletTiHiCalculator({
        palletDeckLengthCm: 120,
        palletDeckWidthCm: 100,
        usableStackHeightCm: 180,
        cartonLengthCm: Number.NaN,
        cartonWidthCm: 30,
        cartonHeightCm: 25,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateCartonsPerPalletTiHiCalculator({
        palletDeckLengthCm: Number.MAX_VALUE,
        palletDeckWidthCm: 100,
        usableStackHeightCm: 180,
        cartonLengthCm: Number.MIN_VALUE,
        cartonWidthCm: 30,
        cartonHeightCm: 25,
      }),
    ).toThrow("too large to represent safely");
  });
});
