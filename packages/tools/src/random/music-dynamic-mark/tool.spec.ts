import { describe, expect, it } from "vitest";
import {
  calculateRandomMusicDynamicMark,
  randomMusicDynamicMarkExample,
  randomMusicDynamicMarkValueCount,
  runRandomMusicDynamicMark,
} from "./tool.js";

describe("Random Music Dynamic Mark Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMusicDynamicMark(randomMusicDynamicMarkExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝆌" } });
    expect(
      runRandomMusicDynamicMark(randomMusicDynamicMarkExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝉦" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMusicDynamicMarkValueCount },
        (_, index) =>
          calculateRandomMusicDynamicMark(
            () => (index + 0.5) / randomMusicDynamicMarkValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMusicDynamicMarkValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMusicDynamicMark({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
