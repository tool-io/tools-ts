import { describe, expect, it } from "vitest";
import { runDecimalToOctal } from "./tool.js";
describe("Decimal to Octal Converter", () => {
  it("calculates a valid result", () => {
    expect(runDecimalToOctal({ decimal: 64 })).toEqual({
      ok: true,
      output: { octal: "100" },
    });
  });
  it("rejects invalid input", () =>
    expect(runDecimalToOctal(null).ok).toBe(false));
});
