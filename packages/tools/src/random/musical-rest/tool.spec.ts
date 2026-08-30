import { describe, expect, it } from "vitest";
import {
  calculateRandomMusicalRest,
  randomMusicalRestExample,
  randomMusicalRestValueCount,
  runRandomMusicalRest,
} from "./tool.js";

describe("Random Musical Rest Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMusicalRest(randomMusicalRestExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𝄩" } });
    expect(
      runRandomMusicalRest(randomMusicalRestExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝉕" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMusicalRestValueCount },
        (_, index) =>
          calculateRandomMusicalRest(
            () => (index + 0.5) / randomMusicalRestValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMusicalRestValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMusicalRest({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
