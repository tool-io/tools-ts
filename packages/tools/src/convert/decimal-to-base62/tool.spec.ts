import { describe, expect, it } from "vitest";
import { runDecimalToBase62 } from "./tool.js";

describe("Decimal to Base62 Converter", () => {
  it("calculates a valid result", () => {
    expect(runDecimalToBase62({ value: 61 })).toEqual({
      ok: true,
      output: { base62: "z" },
    });
    expect(runDecimalToBase62({ value: 62 })).toEqual({
      ok: true,
      output: { base62: "10" },
    });
  });

  it("maps zero to the zero digit", () => {
    expect(runDecimalToBase62({ value: 0 })).toEqual({
      ok: true,
      output: { base62: "0" },
    });
  });

  it("rejects invalid input", () =>
    expect(runDecimalToBase62(null).ok).toBe(false));
});
