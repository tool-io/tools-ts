import { describe, expect, it } from "vitest";
import {
  calculatePalletLoadHeightWithBaseTotal,
  palletLoadHeightWithBaseTotalExample,
  runPalletLoadHeightWithBaseTotal,
} from "./tool.js";

describe("pallet-load-height-with-base-total", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPalletLoadHeightWithBaseTotal(
        palletLoadHeightWithBaseTotalExample.input,
      ),
    ).toEqual({
      ok: true,
      output: palletLoadHeightWithBaseTotalExample.output,
    });
  });

  it("handles a single layer on a floor-stacked base of zero", () => {
    expect(
      runPalletLoadHeightWithBaseTotal({
        palletBaseHeightCm: 0,
        cartonHeightCm: 33.5,
        layerCount: 1,
      }),
    ).toEqual({
      ok: true,
      output: { loadHeightAboveDeckCm: 33.5, totalStackHeightCm: 33.5 },
    });
  });
  it("rejects zero carton heights", () => {
    expect(
      runPalletLoadHeightWithBaseTotal({
        palletBaseHeightCm: 14.4,
        cartonHeightCm: 0,
        layerCount: 5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite dimensions and overflowing stacks", () => {
    expect(() =>
      calculatePalletLoadHeightWithBaseTotal({
        cartonHeightCm: Number.NaN,
        layerCount: 5,
        palletBaseHeightCm: 14.4,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculatePalletLoadHeightWithBaseTotal({
        cartonHeightCm: Number.MAX_VALUE,
        layerCount: 2,
        palletBaseHeightCm: 0,
      }),
    ).toThrow("outside the representable range");
  });
});
