import { describe, expect, it } from "vitest";
import { hillN1Example, runHillN1 } from "./tool.js";

describe("Hill Number N1", () => {
  it("publishes an executable example", () =>
    expect(runHillN1(hillN1Example.input)).toEqual({
      ok: true,
      output: hillN1Example.output,
    }));
  it("maps zero entropy to one effective species", () =>
    expect(runHillN1({ shannonNaturalH: 0 })).toEqual({
      ok: true,
      output: { hillN1: 1 },
    }));
  it("recovers the natural logarithm identity", () =>
    expect(Math.round(runHillN1Safe({ shannonNaturalH: Math.log(10) }))).toBe(
      10,
    ));
  it("grows monotonically with entropy", () => {
    const low = runHillN1Safe({ shannonNaturalH: 0.5 });
    const high = runHillN1Safe({ shannonNaturalH: 2 });
    expect(high).toBeGreaterThan(low);
  });
  it("keeps fractional outputs", () =>
    expect(runHillN1Safe({ shannonNaturalH: 0.5 })).toBeCloseTo(
      1.6487212707001282,
      12,
    ));
  it("rejects negative entropy", () =>
    expect(runHillN1({ shannonNaturalH: -0.1 }).ok).toBe(false));
});

const runHillN1Safe = (input: { readonly shannonNaturalH: number }): number => {
  const result = runHillN1(input);
  if (!result.ok) throw new Error("expected success");
  return Number(result.output.hillN1);
};
