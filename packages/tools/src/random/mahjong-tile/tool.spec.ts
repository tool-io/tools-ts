import { describe, expect, it } from "vitest";
import {
  calculateRandomMahjongTile,
  randomMahjongTileExample,
  randomMahjongTileValueCount,
  runRandomMahjongTile,
} from "./tool.js";

describe("Random Mahjong Tile Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMahjongTile(randomMahjongTileExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "🀀" } });
    expect(
      runRandomMahjongTile(randomMahjongTileExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🀫" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMahjongTileValueCount },
        (_, index) =>
          calculateRandomMahjongTile(
            () => (index + 0.5) / randomMahjongTileValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMahjongTileValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMahjongTile({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
