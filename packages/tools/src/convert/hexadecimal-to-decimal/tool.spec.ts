import { describe, expect, it } from "vitest";
import { runHexadecimalToDecimal } from "./tool.js";
describe("Hexadecimal to Decimal Converter", () => {
  it("calculates a valid result", () => {
    expect(runHexadecimalToDecimal({ hexadecimal: "FF" })).toEqual({
      ok: true,
      output: { decimal: 255 },
    });
  });
  it("rejects invalid input", () =>
    expect(runHexadecimalToDecimal({ hexadecimal: "FG" }).ok).toBe(false));
});
