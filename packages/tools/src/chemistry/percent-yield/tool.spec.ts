import { describe, expect, it } from "vitest";
import { percentYieldExample, runPercentYield } from "./tool.js";

describe("Percent Yield Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPercentYield(percentYieldExample.input)).toEqual({
      ok: true,
      output: percentYieldExample.output,
    });
  });

  it("reports one hundred percent when actual equals theoretical", () => {
    expect(
      runPercentYield({ actualYieldGrams: 5, theoreticalYieldGrams: 5 }),
    ).toEqual({
      ok: true,
      output: { percentYield: 100 },
    });
  });

  it("reports zero percent for a zero actual yield", () => {
    expect(
      runPercentYield({ actualYieldGrams: 0, theoreticalYieldGrams: 5 }),
    ).toEqual({
      ok: true,
      output: { percentYield: 0 },
    });
  });

  it("computes fractional percentages", () => {
    expect(
      runPercentYield({ actualYieldGrams: 2.5, theoreticalYieldGrams: 5 }),
    ).toEqual({
      ok: true,
      output: { percentYield: 50 },
    });
  });

  it("reports apparent yields above 100 percent", () =>
    expect(
      runPercentYield({ actualYieldGrams: 6, theoreticalYieldGrams: 5 }),
    ).toEqual({ ok: true, output: { percentYield: 120 } }));

  it("rejects a zero theoretical yield", () => {
    expect(
      runPercentYield({ actualYieldGrams: 1, theoreticalYieldGrams: 0 }).ok,
    ).toBe(false);
  });

  it("rejects a negative actual yield", () => {
    expect(
      runPercentYield({ actualYieldGrams: -1, theoreticalYieldGrams: 5 }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runPercentYield({ actualYieldGrams: 1 }).ok).toBe(false);
    expect(runPercentYield({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runPercentYield(80).ok).toBe(false);
  });
});
