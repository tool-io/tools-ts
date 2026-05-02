import { describe, expect, it } from "vitest";
import { centimetersToMetersTool, convertCentimetersToMeters } from "./tool.js";

describe("centimeters to meters", () => {
  it("converts finite positive, zero, and negative lengths", () => {
    expect(convertCentimetersToMeters({ centimeters: 175 })).toEqual({
      ok: true,
      output: { meters: 1.75 },
    });
    expect(convertCentimetersToMeters({ centimeters: -20 })).toEqual({
      ok: true,
      output: { meters: -0.2 },
    });
  });

  it("rejects malformed and non-finite input without undefined", () => {
    for (const input of [undefined, {}, { centimeters: Infinity }])
      expect(convertCentimetersToMeters(input)).toMatchObject({ ok: false });
  });

  it("is a narrow wrapper rather than a separately registered connector", () => {
    expect(centimetersToMetersTool.ports?.connector).not.toBe(true);
  });
});
