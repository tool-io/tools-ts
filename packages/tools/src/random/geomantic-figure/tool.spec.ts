import { describe, expect, it } from "vitest";
import {
  calculateRandomGeomanticFigure,
  randomGeomanticFigureExample,
  randomGeomanticFigureValueCount,
  runRandomGeomanticFigure,
} from "./tool.js";

describe("Random Geomantic Figure Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGeomanticFigure(randomGeomanticFigureExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𜻠" } });
    expect(
      runRandomGeomanticFigure(randomGeomanticFigureExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𜻯" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGeomanticFigureValueCount },
        (_, index) =>
          calculateRandomGeomanticFigure(
            () => (index + 0.5) / randomGeomanticFigureValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGeomanticFigureValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGeomanticFigure({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
