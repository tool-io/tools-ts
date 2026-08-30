import { describe, expect, it } from "vitest";
import {
  calculateRandomCuneiformSign,
  randomCuneiformSignExample,
  randomCuneiformSignValueCount,
  runRandomCuneiformSign,
} from "./tool.js";

describe("Random Cuneiform Sign Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCuneiformSign(randomCuneiformSignExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𒀀" } });
    expect(
      runRandomCuneiformSign(randomCuneiformSignExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𒚆" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCuneiformSignValueCount },
        (_, index) =>
          calculateRandomCuneiformSign(
            () => (index + 0.5) / randomCuneiformSignValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCuneiformSignValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCuneiformSign({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
