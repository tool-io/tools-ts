import { describe, expect, it } from "vitest";
import { morishitaIndexExample, runMorishitaIndex } from "./tool.js";

describe("Morishita Index", () => {
  it("publishes an executable example", () =>
    expect(runMorishitaIndex(morishitaIndexExample.input)).toEqual({
      ok: true,
      output: morishitaIndexExample.output,
    }));
  it("is below one for a uniform fixed-count distribution", () =>
    expect(runMorishitaIndex({ countA: 5, countB: 5, countC: 5 })).toEqual({
      ok: true,
      output: { morishitaIndex: 0.8571428571428571 },
    }));
  it("rises with clumping", () =>
    expect(runMorishitaIndex({ countA: 1, countB: 2, countC: 3 })).toEqual({
      ok: true,
      output: { morishitaIndex: 0.8 },
    }));
  it("handles the smallest viable sample", () =>
    expect(runMorishitaIndex({ countA: 2, countB: 0, countC: 0 })).toEqual({
      ok: true,
      output: { morishitaIndex: 3 },
    }));
  it("rejects a single individual in total", () => {
    const result = runMorishitaIndex({
      countA: 1,
      countB: 0,
      countC: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("insufficient_samples");
  });
  it("rejects an empty sample", () =>
    expect(runMorishitaIndex({ countA: 0, countB: 0, countC: 0 }).ok).toBe(
      false,
    ));
  it("rejects fractional counts", () =>
    expect(runMorishitaIndex({ countA: 2.5, countB: 2, countC: 2 }).ok).toBe(
      false,
    ));
});
