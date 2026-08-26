import { describe, expect, it } from "vitest";
import {
  oldAgeProportion65PlusExample,
  runOldAgeProportion65Plus,
} from "./tool.js";

describe("old-age-proportion-65-plus", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOldAgeProportion65Plus(oldAgeProportion65PlusExample.input),
    ).toEqual({
      ok: true,
      output: oldAgeProportion65PlusExample.output,
    });
  });

  it("reaches one hundred percent when everyone is 65 or older", () => {
    const r = runOldAgeProportion65Plus({
      population65Plus: 40,
      totalPopulation: 40,
    });
    expect(r.ok && r.output.oldAgeProportionPercent).toBe(100);
  });

  it("rejects a 65+ count above the total", () => {
    expect(
      runOldAgeProportion65Plus({ population65Plus: 11, totalPopulation: 10 })
        .ok,
    ).toBe(false);
  });
});
