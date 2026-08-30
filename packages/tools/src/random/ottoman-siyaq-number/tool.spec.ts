import { describe, expect, it } from "vitest";
import {
  calculateRandomOttomanSiyaqNumber,
  randomOttomanSiyaqNumberExample,
  randomOttomanSiyaqNumberValueCount,
  runRandomOttomanSiyaqNumber,
} from "./tool.js";

describe("Random Ottoman Siyaq Number Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOttomanSiyaqNumber(randomOttomanSiyaqNumberExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𞴁" } });
    expect(
      runRandomOttomanSiyaqNumber(randomOttomanSiyaqNumberExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞴽" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOttomanSiyaqNumberValueCount },
        (_, index) =>
          calculateRandomOttomanSiyaqNumber(
            () => (index + 0.5) / randomOttomanSiyaqNumberValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOttomanSiyaqNumberValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOttomanSiyaqNumber({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
