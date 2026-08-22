import { describe, expect, it } from "vitest";
import { runParsecToLightYear } from "./tool.js";

describe("Parsec to Light Year Converter", () => {
  it("calculates a valid result", () => {
    expect(runParsecToLightYear({ parsecs: 1 })).toEqual({
      ok: true,
      output: { lightYears: expect.closeTo(3.26156, 5) },
    });
    expect(runParsecToLightYear({ parsecs: 248 })).toEqual({
      ok: true,
      output: { lightYears: expect.closeTo(808.87, 2) },
    });
  });

  it("rejects invalid input", () =>
    expect(runParsecToLightYear(null).ok).toBe(false));
});
