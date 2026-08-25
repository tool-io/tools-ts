import { describe, expect, it } from "vitest";
import {
  calculateChainCatenarySag,
  chainCatenarySagExample,
  runChainCatenarySag,
} from "./tool.js";

describe("Chain Catenary Sag Calculator", () => {
  it("publishes an executable example", () =>
    expect(runChainCatenarySag(chainCatenarySagExample.input)).toEqual({
      ok: true,
      output: chainCatenarySagExample.output,
    }));

  it.each([
    [2, 20, 5000, 0.196133],
    [2, 10, 5000, 0.04903325],
    [1, 30, 2000, 0.5516240625],
    [3, 15, 2500, 0.3309744375],
    [0.5, 40, 8000, 0.122583125],
  ])("estimates the catenary sag", (weight, span, tension, expected) => {
    expect(calculateChainCatenarySag(weight, span, tension)).toBe(expected);
  });

  it("scales linearly with weight per meter", () => {
    expect(calculateChainCatenarySag(1, 20, 5000)).toBe(
      calculateChainCatenarySag(2, 20, 5000)! / 2,
    );
  });

  it("halves the sag when tension doubles", () => {
    const base = calculateChainCatenarySag(2, 20, 5000)!;
    expect(calculateChainCatenarySag(2, 20, 10000)).toBe(base / 2);
  });

  it("returns zero sag for weightless line", () => {
    expect(calculateChainCatenarySag(0, 20, 5000)).toBe(0);
  });

  it.each([
    [2, 0, 5000],
    [2, -5, 5000],
    [2, 20, 0],
    [2, 20, -100],
  ])("rejects non-positive span or tension", (weight, span, tension) => {
    expect(calculateChainCatenarySag(weight, span, tension)).toBeNull();
    const result = runChainCatenarySag({
      weightPerMeterKg: weight,
      spanMeters: span,
      tensionNewtons: tension,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects negative weight per meter", () => {
    expect(calculateChainCatenarySag(-1, 20, 5000)).toBeNull();
    const result = runChainCatenarySag({
      weightPerMeterKg: -1,
      spanMeters: 20,
      tensionNewtons: 5000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects non-finite inputs", () => {
    const result = runChainCatenarySag({
      weightPerMeterKg: Number.NaN,
      spanMeters: 20,
      tensionNewtons: 5000,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runChainCatenarySag({
      weightPerMeterKg: 2,
      spanMeters: 20,
      tensionNewtons: 5000,
      extra: 1,
    });
    expect(result.ok).toBe(false);
  });
});
