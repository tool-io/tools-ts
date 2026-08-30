import { describe, expect, it } from "vitest";
import {
  calculateRandomTrafficSign,
  randomTrafficSignExample,
  randomTrafficSignValueCount,
  runRandomTrafficSign,
} from "./tool.js";

describe("Random Traffic Sign Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTrafficSign(randomTrafficSignExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "stop" } });
    expect(
      runRandomTrafficSign(randomTrafficSignExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "one-way" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTrafficSignValueCount },
        (_, index) =>
          calculateRandomTrafficSign(
            () => (index + 0.5) / randomTrafficSignValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTrafficSignValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTrafficSign({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
