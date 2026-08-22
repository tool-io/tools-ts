import { describe, expect, it } from "vitest";
import { runReverseInBase } from "./tool.js";

describe("Reverse in Base Tool", () => {
  it("calculates a valid result", () => {
    expect(runReverseInBase({ base: 10, value: 123 })).toEqual({
      ok: true,
      output: { reversed: 321 },
    });
    expect(runReverseInBase({ base: 2, value: 13 })).toEqual({
      ok: true,
      output: { reversed: 11 },
    });
  });

  it("maps zero to zero in any base", () => {
    expect(runReverseInBase({ base: 16, value: 0 })).toEqual({
      ok: true,
      output: { reversed: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runReverseInBase(null).ok).toBe(false));
});
