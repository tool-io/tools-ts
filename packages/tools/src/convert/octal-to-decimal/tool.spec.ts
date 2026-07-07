import { describe, expect, it } from "vitest";
import { runOctalToDecimal } from "./tool.js";
describe("Octal to Decimal Converter", () => {
  it("calculates a valid result", () => {
    expect(runOctalToDecimal({ octal: "100" })).toEqual({
      ok: true,
      output: { decimal: 64 },
    });
  });
  it("rejects invalid input", () =>
    expect(runOctalToDecimal({ octal: "89" }).ok).toBe(false));
});
