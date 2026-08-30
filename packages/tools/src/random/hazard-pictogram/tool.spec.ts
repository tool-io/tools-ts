import { describe, expect, it } from "vitest";
import {
  calculateRandomHazardPictogram,
  randomHazardPictogramExample,
  randomHazardPictogramValueCount,
  runRandomHazardPictogram,
} from "./tool.js";

describe("Random Hazard Pictogram Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomHazardPictogram(randomHazardPictogramExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "GHS01 — Exploding bomb" } });
    expect(
      runRandomHazardPictogram(randomHazardPictogramExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "GHS09 — Environment" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomHazardPictogramValueCount },
        (_, index) =>
          calculateRandomHazardPictogram(
            () => (index + 0.5) / randomHazardPictogramValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHazardPictogramValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomHazardPictogram({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
