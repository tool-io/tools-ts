import { describe, expect, it } from "vitest";
import { fisherAlphaExample, runFisherAlpha } from "./tool.js";

describe("Fisher Alpha", () => {
  it("publishes an executable example", () =>
    expect(runFisherAlpha(fisherAlphaExample.input)).toEqual({
      ok: true,
      output: fisherAlphaExample.output,
    }));
  it("solves the defining relation to bisection precision", () => {
    const result = runFisherAlpha({
      individualCountInt: 100,
      speciesCountInt: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const alpha = Number(result.output.fisherAlpha);
      expect(alpha * Math.log(1 + 100 / alpha)).toBeCloseTo(10, 8);
    }
  });
  it("returns a second documented root", () => {
    const result = runFisherAlpha({
      individualCountInt: 200,
      speciesCountInt: 25,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.fisherAlpha).toBeCloseTo(7.54175713653853, 12);
  });
  it("grows alpha with species count at fixed individuals", () => {
    const few = runFisherAlphaSafe({
      individualCountInt: 500,
      speciesCountInt: 20,
    });
    const many = runFisherAlphaSafe({
      individualCountInt: 500,
      speciesCountInt: 80,
    });
    expect(many).toBeGreaterThan(few);
  });
  it("accepts the smallest community", () =>
    expect(
      runFisherAlphaSafe({ individualCountInt: 2, speciesCountInt: 1 }),
    ).toBeGreaterThan(0));
  it("rejects species counts above the individual count", () => {
    const result = runFisherAlpha({
      individualCountInt: 100,
      speciesCountInt: 200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("degenerate_input");
  });
  it("rejects an all-singleton sample with no finite solution", () =>
    expect(
      runFisherAlpha({ individualCountInt: 100, speciesCountInt: 100 }).ok,
    ).toBe(false));
  it("solves values whose root exceeds the old fixed bracket", () => {
    const result = runFisherAlpha({
      individualCountInt: 1000,
      speciesCountInt: 990,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.fisherAlpha).toBeGreaterThan(10000);
  });
  it("rejects zero species counts", () =>
    expect(
      runFisherAlpha({ individualCountInt: 50, speciesCountInt: 0 }).ok,
    ).toBe(false));
  it("rejects zero individuals", () =>
    expect(
      runFisherAlpha({ individualCountInt: 0, speciesCountInt: 5 }).ok,
    ).toBe(false));
});

const runFisherAlphaSafe = (input: {
  readonly individualCountInt: number;
  readonly speciesCountInt: number;
}): number => {
  const result = runFisherAlpha(input);
  if (!result.ok) throw new Error("expected success");
  return Number(result.output.fisherAlpha);
};
