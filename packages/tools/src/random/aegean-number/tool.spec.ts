import { describe, expect, it } from "vitest";
import {
  calculateRandomAegeanNumber,
  randomAegeanNumberExample,
  randomAegeanNumberValueCount,
  runRandomAegeanNumber,
} from "./tool.js";

describe("Random Aegean Number Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAegeanNumber(randomAegeanNumberExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐄇" } });
    expect(
      runRandomAegeanNumber(randomAegeanNumberExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐄳" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAegeanNumberValueCount },
        (_, index) =>
          calculateRandomAegeanNumber(
            () => (index + 0.5) / randomAegeanNumberValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAegeanNumberValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAegeanNumber({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
