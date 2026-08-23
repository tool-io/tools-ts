import { describe, expect, it } from "vitest";
import { runIpdFromPupils } from "./tool.js";

describe("IPD From Pupils Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIpdFromPupils({ leftPupilMm: 31, rightPupilMm: 65 })).toEqual({
      ok: true,
      output: { ipdMm: 34 },
    });
  });

  it("uses the absolute separation", () => {
    expect(runIpdFromPupils({ leftPupilMm: 70, rightPupilMm: 36 })).toEqual({
      ok: true,
      output: { ipdMm: 34 },
    });
  });

  it("rejects invalid input", () =>
    expect(runIpdFromPupils(null).ok).toBe(false));
});
