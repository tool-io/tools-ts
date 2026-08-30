import { describe, expect, it } from "vitest";
import {
  calculateRandomIndicSiyaqNumber,
  randomIndicSiyaqNumberExample,
  randomIndicSiyaqNumberValueCount,
  runRandomIndicSiyaqNumber,
} from "./tool.js";

describe("Random Indic Siyaq Number Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomIndicSiyaqNumber(randomIndicSiyaqNumberExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𞱱" } });
    expect(
      runRandomIndicSiyaqNumber(randomIndicSiyaqNumberExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞲴" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomIndicSiyaqNumberValueCount },
        (_, index) =>
          calculateRandomIndicSiyaqNumber(
            () => (index + 0.5) / randomIndicSiyaqNumberValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomIndicSiyaqNumberValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomIndicSiyaqNumber({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
