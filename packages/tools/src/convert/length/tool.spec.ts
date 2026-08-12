import { describe, expect, it } from "vitest";
import { lengthFactors } from "./factors.js";
import { lengthReferenceFactors, lengthReferences } from "./references.js";
import {
  convertLength,
  convertLengthExample,
  convertLengthValue,
  lengthConversionTool,
} from "./tool.js";

describe("convert length", () => {
  it("converts between metric and US customary units", () => {
    expect(convertLength({ fromUnit: "ft", toUnit: "m", value: 10 })).toEqual({
      ok: true,
      output: { unit: "m", value: 3.048 },
    });
    expect(convertLengthValue(175, "cm", "m")).toBe(1.75);
  });

  it("runs its canonical example exactly", () => {
    expect(convertLength(convertLengthExample.input)).toEqual({
      ok: true,
      output: convertLengthExample.output,
    });
  });

  it("includes every SI prefix from quecto through quetta", () => {
    expect(convertLengthValue(1, "qm", "m")).toBe(1e-30);
    expect(convertLengthValue(1, "Qm", "m")).toBe(1e30);
    expect(convertLengthValue(1, "um", "m")).toBe(1e-6);
  });

  it("keeps legacy US survey units distinct and internally consistent", () => {
    expect(lengthFactors["ft-us"]!.factor).not.toBe(lengthFactors.ft!.factor);
    expect(convertLengthValue(5280, "ft-us", "mi-us")).toBeCloseTo(1, 12);
  });

  it("converts astronomical scales", () => {
    expect(convertLengthValue(1, "light-second", "m")).toBe(299_792_458);
    expect(convertLengthValue(1, "au", "m")).toBe(149_597_870_700);
    expect(convertLengthValue(1, "pc", "au")).toBeCloseTo(648_000 / Math.PI, 8);
  });

  it("converts units directly to real and fictional comparisons", () => {
    expect(
      convertLengthValue(1, "au", "reference:spacex-starship-v3"),
    ).toBeCloseTo(149_597_870_700 / 124.4, 6);
    expect(convertLengthValue(641, "m", "reference:enterprise-d")).toBeCloseTo(
      1,
      12,
    );
  });

  it("supports animal, game, yacht, and carrier comparisons", () => {
    expect(convertLengthValue(30, "m", "reference:blue-whale")).toBe(1);
    expect(convertLengthValue(1, "m", "reference:tardigrade")).toBe(2000);
    expect(convertLengthValue(100, "m", "reference:zoe-zakat")).toBe(1);
    expect(convertLengthValue(180.61, "m", "reference:azzam-yacht")).toBe(1);
    expect(
      convertLengthValue(1, "reference:uss-gerald-r-ford", "m"),
    ).toBeCloseTo(332.8416, 10);
    expect(
      convertLengthValue(1, "reference:fujian-aircraft-carrier", "m"),
    ).toBe(316);
  });

  it("preserves regional and historical unit distinctions", () => {
    expect(convertLengthValue(6, "shaku-jp", "ken-jp")).toBeCloseTo(1, 12);
    expect(convertLengthValue(36, "cho-jp-length", "ri-jp")).toBeCloseTo(1, 12);
    expect(lengthFactors["ell-english"]!.factor).not.toBe(
      lengthFactors["ell-flemish"]!.factor,
    );
    expect(lengthFactors["cubit-egyptian-common"]!.factor).not.toBe(
      lengthFactors["cubit-egyptian-royal"]!.factor,
    );
  });

  it("supports zero and negative values", () => {
    expect(convertLength({ fromUnit: "m", toUnit: "cm", value: -0.2 })).toEqual(
      {
        ok: true,
        output: { unit: "cm", value: -20 },
      },
    );
  });

  it("rejects malformed, unknown, and non-finite input", () => {
    for (const input of [
      undefined,
      {},
      { fromUnit: "unknown", toUnit: "m", value: 1 },
      { fromUnit: "cm", toUnit: "m", value: Infinity },
    ])
      expect(convertLength(input)).toMatchObject({ ok: false });
  });

  it("publishes portable length ports for contextual connector discovery", () => {
    expect(lengthConversionTool.ports?.inputs[0]).toMatchObject({
      valueType: { format: "length", type: "number" },
    });
    expect(lengthConversionTool.ports?.outputs[0]).toMatchObject({
      valueType: { format: "length", type: "number" },
    });
    expect(lengthConversionTool.ports?.inputs.map(({ id }) => id)).toEqual([
      "value",
      "fromUnit",
      "toUnit",
    ]);
  });

  it("publishes every supported standard and comparison unit in its schema", () => {
    const fromUnit = lengthConversionTool.inputSchema.properties?.fromUnit;
    expect(fromUnit?.enum).toHaveLength(
      Object.keys(lengthFactors).length + Object.keys(lengthReferences).length,
    );
    expect(fromUnit?.enum).toContain("reference:blue-whale");
    expect(fromUnit?.enum).toContain("Qm");
  });

  it("contains only usable, attributed length data", () => {
    for (const unit of [
      ...Object.values(lengthFactors),
      ...Object.values(lengthReferenceFactors),
    ]) {
      expect(unit.name.length).toBeGreaterThan(0);
      expect(Number.isFinite(unit.factor)).toBe(true);
      expect(unit.factor).toBeGreaterThan(0);
      expect(unit.cite.startsWith("https://")).toBe(true);
    }
  });
});
