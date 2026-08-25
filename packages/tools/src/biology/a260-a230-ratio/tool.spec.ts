import { describe, expect, it } from "vitest";
import { runA260A230Ratio } from "./tool.js";

describe("260/230 Ratio", () => {
  it("calculates a valid result", () =>
    expect(runA260A230Ratio({ absorbance260: 2.2, absorbance230: 1 })).toEqual({
      ok: true,
      output: { purityRatio: 2.2 },
    }));
  it("handles fractional denominators", () =>
    expect(runA260A230Ratio({ absorbance260: 2, absorbance230: 0.8 })).toEqual({
      ok: true,
      output: { purityRatio: 2.5 },
    }));
  it("returns zero without nucleic acid signal", () =>
    expect(runA260A230Ratio({ absorbance260: 0, absorbance230: 1 })).toEqual({
      ok: true,
      output: { purityRatio: 0 },
    }));
  it("rejects negative A260", () =>
    expect(runA260A230Ratio({ absorbance260: -2, absorbance230: 1 }).ok).toBe(
      false,
    ));
  it("rejects a zero denominator", () =>
    expect(runA260A230Ratio({ absorbance260: 2, absorbance230: 0 }).ok).toBe(
      false,
    ));
});
