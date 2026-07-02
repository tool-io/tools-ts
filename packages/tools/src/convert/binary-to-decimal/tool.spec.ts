import { describe, expect, it } from "vitest";
import { runBinaryToDecimal } from "./tool.js";
describe("Binary to Decimal Converter", () => {
  it("calculates a valid result", () => {
    expect(runBinaryToDecimal({ binary: "101010" })).toEqual({
      ok: true,
      output: { decimal: 42 },
    });
  });
  it("rejects invalid input", () =>
    expect(runBinaryToDecimal({ binary: "102" }).ok).toBe(false));
});
