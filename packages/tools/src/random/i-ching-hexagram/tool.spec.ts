import { describe, expect, it } from "vitest";
import {
  calculateRandomIChingHexagram,
  randomIChingHexagramExample,
  randomIChingHexagramValueCount,
  runRandomIChingHexagram,
} from "./tool.js";

describe("Random I Ching Hexagram Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomIChingHexagram(randomIChingHexagramExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "䷀" } });
    expect(
      runRandomIChingHexagram(randomIChingHexagramExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "䷿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomIChingHexagramValueCount },
        (_, index) =>
          calculateRandomIChingHexagram(
            () => (index + 0.5) / randomIChingHexagramValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomIChingHexagramValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomIChingHexagram({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
