import { describe, expect, it } from "vitest";
import {
  calculateRandomPlayingCard,
  randomPlayingCardExample,
  randomPlayingCardValueCount,
  runRandomPlayingCard,
} from "./tool.js";

describe("Random Playing Card Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPlayingCard(randomPlayingCardExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "🂠" } });
    expect(
      runRandomPlayingCard(randomPlayingCardExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🃵" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPlayingCardValueCount },
        (_, index) =>
          calculateRandomPlayingCard(
            () => (index + 0.5) / randomPlayingCardValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPlayingCardValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomPlayingCard({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
