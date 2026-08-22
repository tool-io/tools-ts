import { describe, expect, it } from "vitest";
import { runEmirpChecker } from "./tool.js";

describe("Emirp Checker", () => {
  it("calculates a valid result", () => {
    expect(runEmirpChecker({ value: 13 })).toEqual({
      ok: true,
      output: { emirp: true },
    });
    expect(runEmirpChecker({ value: 7 })).toEqual({
      ok: true,
      output: { emirp: false },
    });
    expect(runEmirpChecker({ value: 12 })).toEqual({
      ok: true,
      output: { emirp: false },
    });
  });

  it("rejects invalid input", () =>
    expect(runEmirpChecker(null).ok).toBe(false));
});
