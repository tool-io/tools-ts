import { describe, expect, it } from "vitest";
import { runDecimalToBinary } from "./tool.js";
describe("Decimal to Binary Converter", () => {
  it("calculates a valid result", () => {
    expect(runDecimalToBinary({ decimal: 42 })).toEqual({
      ok: true,
      output: { binary: "101010" },
    });
  });
  it("rejects invalid input", () =>
    expect(runDecimalToBinary(null).ok).toBe(false));
});
