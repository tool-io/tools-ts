import { describe, expect, it } from "vitest";
import { runPpbPpmConversion } from "./tool.js";

describe("PPB to PPM Converter", () => {
  it("calculates a valid result", () => {
    expect(runPpbPpmConversion({ ppb: 5000 })).toEqual({
      ok: true,
      output: { ppm: 5 },
    });
  });

  it("rejects invalid input", () =>
    expect(runPpbPpmConversion(null).ok).toBe(false));
});
