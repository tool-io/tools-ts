import { describe, expect, it } from "vitest";
import { convertLength, convertLengthValue, lengthConversionTool } from "./tool.js";

describe("convert length", () => {
  it("converts between metric and US customary units", () => {
    expect(convertLength({ fromUnit: "ft", toUnit: "m", value: 10 })).toEqual({
      ok: true,
      output: { unit: "m", value: 3.048 },
    });
    expect(convertLengthValue(175, "cm", "m")).toBe(1.75);
  });

  it("supports zero and negative values", () => {
    expect(convertLength({ fromUnit: "m", toUnit: "cm", value: -0.2 })).toEqual({
      ok: true,
      output: { unit: "cm", value: -20 },
    });
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

  it("is a configurable length connector", () => {
    expect(lengthConversionTool.ports).toMatchObject({ connector: true });
    expect(lengthConversionTool.ports?.inputs.map(({ id }) => id)).toEqual([
      "value",
      "fromUnit",
      "toUnit",
    ]);
  });
});
