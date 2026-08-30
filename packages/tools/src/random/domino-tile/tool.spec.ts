import { describe, expect, it } from "vitest";
import {
  calculateRandomDominoTile,
  randomDominoTileExample,
  randomDominoTileValueCount,
  runRandomDominoTile,
} from "./tool.js";

describe("Random Domino Tile Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDominoTile(randomDominoTileExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "🀰" } });
    expect(
      runRandomDominoTile(randomDominoTileExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🂓" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDominoTileValueCount },
        (_, index) =>
          calculateRandomDominoTile(
            () => (index + 0.5) / randomDominoTileValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDominoTileValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDominoTile({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
