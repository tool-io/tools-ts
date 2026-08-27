import { describe, expect, it } from "vitest";
import {
  capacitorColorCodeExample,
  runCapacitorColorCodeDecode,
} from "./tool.js";

describe("Capacitor Color Code", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapacitorColorCodeDecode(capacitorColorCodeExample.input),
    ).toEqual({
      ok: true,
      output: capacitorColorCodeExample.output,
    });
  });

  it("decodes brown-red-yellow to 120 nanofarads", () => {
    expect(
      runCapacitorColorCodeDecode({
        band1: "brown",
        band2: "red",
        band3: "yellow",
      }),
    ).toEqual({ ok: true, output: { capacitanceNf: 120 } });
  });

  it("decodes red-red-red to 2.2 nanofarads", () => {
    expect(
      runCapacitorColorCodeDecode({ band1: "red", band2: "red", band3: "red" }),
    ).toEqual({ ok: true, output: { capacitanceNf: 2.2 } });
  });

  it("scales picofarads into nanofarads for large multipliers", () => {
    expect(
      runCapacitorColorCodeDecode({
        band1: "brown",
        band2: "black",
        band3: "green",
      }),
    ).toEqual({ ok: true, output: { capacitanceNf: 1000 } });
  });

  it("rejects colors outside the palette", () => {
    expect(
      runCapacitorColorCodeDecode({
        band1: "silver",
        band2: "black",
        band3: "red",
      }).ok,
    ).toBe(false);
  });

  it("requires all three bands", () => {
    expect(
      runCapacitorColorCodeDecode({ band1: "brown", band3: "yellow" }).ok,
    ).toBe(false);
  });
});
