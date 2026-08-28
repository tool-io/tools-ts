import { describe, expect, it } from "vitest";
import {
  resistorColorCodeDecodeExample,
  runResistorColorCodeDecode,
} from "./tool.js";

describe("Resistor Color Code Decode", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResistorColorCodeDecode(resistorColorCodeDecodeExample.input),
    ).toEqual({
      ok: true,
      output: resistorColorCodeDecodeExample.output,
    });
  });

  it("decodes yellow-violet-orange to 47 kiloohms", () => {
    expect(
      runResistorColorCodeDecode({
        band1: "yellow",
        band2: "violet",
        band3: "orange",
      }),
    ).toEqual({ ok: true, output: { resistanceOhms: 47000 } });
  });

  it("decodes the maximum white-white-white code", () => {
    expect(
      runResistorColorCodeDecode({
        band1: "white",
        band2: "white",
        band3: "white",
      }),
    ).toEqual({ ok: true, output: { resistanceOhms: 99000000000 } });
  });

  it("treats a black multiplier as no scaling", () => {
    expect(
      runResistorColorCodeDecode({
        band1: "green",
        band2: "blue",
        band3: "black",
      }),
    ).toEqual({ ok: true, output: { resistanceOhms: 56 } });
  });

  it("decodes black as digit zero in both significant bands", () => {
    expect(
      runResistorColorCodeDecode({
        band1: "black",
        band2: "black",
        band3: "brown",
      }),
    ).toEqual({ ok: true, output: { resistanceOhms: 0 } });
  });

  it("rejects colors outside the palette", () => {
    expect(
      runResistorColorCodeDecode({
        band1: "pink",
        band2: "black",
        band3: "red",
      }).ok,
    ).toBe(false);
  });

  it("requires all three bands", () => {
    expect(
      runResistorColorCodeDecode({ band1: "brown", band2: "red" }).ok,
    ).toBe(false);
  });
});
