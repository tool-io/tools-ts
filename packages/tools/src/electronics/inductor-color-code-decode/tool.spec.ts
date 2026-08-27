import { describe, expect, it } from "vitest";
import {
  inductorColorCodeExample,
  runInductorColorCodeDecode,
} from "./tool.js";

describe("Inductor Color Code", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInductorColorCodeDecode(inductorColorCodeExample.input)).toEqual({
      ok: true,
      output: inductorColorCodeExample.output,
    });
  });

  it("decodes brown-red-brown to 120 microhenries", () => {
    expect(
      runInductorColorCodeDecode({
        band1: "brown",
        band2: "red",
        band3: "brown",
      }),
    ).toEqual({ ok: true, output: { inductanceUh: 120 } });
  });

  it("decodes yellow-violet-orange to 47000 microhenries", () => {
    expect(
      runInductorColorCodeDecode({
        band1: "yellow",
        band2: "violet",
        band3: "orange",
      }),
    ).toEqual({ ok: true, output: { inductanceUh: 47000 } });
  });

  it("treats a black multiplier as no scaling", () => {
    expect(
      runInductorColorCodeDecode({
        band1: "green",
        band2: "blue",
        band3: "black",
      }),
    ).toEqual({ ok: true, output: { inductanceUh: 56 } });
  });

  it("rejects colors outside the palette", () => {
    expect(
      runInductorColorCodeDecode({
        band1: "gold",
        band2: "black",
        band3: "red",
      }).ok,
    ).toBe(false);
  });

  it("requires all three bands", () => {
    expect(
      runInductorColorCodeDecode({ band2: "violet", band3: "orange" }).ok,
    ).toBe(false);
  });
});
