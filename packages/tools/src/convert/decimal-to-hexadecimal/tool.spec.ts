import { describe, expect, it } from "vitest";
import { runDecimalToHexadecimal } from "./tool.js";
describe("Decimal to Hexadecimal Converter", () => {
  it("calculates a valid result", () => {
    expect(runDecimalToHexadecimal({ decimal: 255 })).toEqual({
      ok: true,
      output: { hexadecimal: "FF" },
    });
  });
  it("rejects invalid input", () =>
    expect(runDecimalToHexadecimal(null).ok).toBe(false));
});
