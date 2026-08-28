import { describe, expect, it } from "vitest";
import { runNormality } from "./tool.js";

describe("Normality Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runNormality({
        equivalentsPerMole: 2,
        moles: 0.5,
        volumeLiters: 1,
      }),
    ).toEqual({ ok: true, output: { normality: 1 } });
  });

  it("rejects invalid input", () => expect(runNormality(null).ok).toBe(false));
});
