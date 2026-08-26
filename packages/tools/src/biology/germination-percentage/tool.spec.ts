import { describe, expect, it } from "vitest";
import {
  germinationPercentageExample,
  runGerminationPercentage,
} from "./tool.js";

describe("Germination Percentage", () => {
  it("publishes an executable example", () =>
    expect(
      runGerminationPercentage(germinationPercentageExample.input),
    ).toEqual({
      ok: true,
      output: germinationPercentageExample.output,
    }));
  it("returns zero when no seeds germinate", () =>
    expect(
      runGerminationPercentage({ germinatedSeedsInt: 0, seedsSownInt: 80 }),
    ).toEqual({
      ok: true,
      output: { germinationPercent: 0 },
    }));
  it("returns one hundred when all seeds germinate", () =>
    expect(
      runGerminationPercentage({ germinatedSeedsInt: 25, seedsSownInt: 25 }),
    ).toEqual({
      ok: true,
      output: { germinationPercent: 100 },
    }));
  it("supports repeating fractions", () => {
    const result = runGerminationPercentage({
      germinatedSeedsInt: 1,
      seedsSownInt: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.germinationPercent).toBeCloseTo(100 / 3, 12);
  });
  it("rejects more germinated seeds than sown", () => {
    const result = runGerminationPercentage({
      germinatedSeedsInt: 51,
      seedsSownInt: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects zero seeds sown", () =>
    expect(
      runGerminationPercentage({ germinatedSeedsInt: 0, seedsSownInt: 0 }).ok,
    ).toBe(false));
  it("rejects non-integer counts", () =>
    expect(
      runGerminationPercentage({ germinatedSeedsInt: 4.5, seedsSownInt: 10 })
        .ok,
    ).toBe(false));
});
