import { describe, expect, it } from "vitest";
import {
  hogsheadBarrelTunConverterExample,
  runHogsheadBarrelTunConverter,
} from "./tool.js";

describe("hogshead-barrel-tun-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHogsheadBarrelTunConverter(hogsheadBarrelTunConverterExample.input),
    ).toEqual({ ok: true, output: hogsheadBarrelTunConverterExample.output });
  });

  it("converts one tierce into fractional larger casks", () => {
    expect(
      runHogsheadBarrelTunConverter({ amount: 1, unit: "tierce" }),
    ).toEqual({
      ok: true,
      output: {
        wineGallons: 42,
        tuns: 42 / 252,
        pipes: 42 / 126,
        hogsheads: 42 / 63,
      },
    });
  });

  it("rejects non-positive amounts", () => {
    expect(runHogsheadBarrelTunConverter({ amount: 0, unit: "tun" }).ok).toBe(
      false,
    );
  });

  it("rejects conversions that overflow", () => {
    expect(
      runHogsheadBarrelTunConverter({ amount: Number.MAX_VALUE, unit: "tun" })
        .ok,
    ).toBe(false);
  });
});
