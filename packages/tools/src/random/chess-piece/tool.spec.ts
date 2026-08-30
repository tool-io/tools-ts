import { describe, expect, it } from "vitest";
import {
  calculateRandomChessPiece,
  randomChessPieceExample,
  randomChessPieceValueCount,
  runRandomChessPiece,
} from "./tool.js";

describe("Random Chess Piece Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomChessPiece(randomChessPieceExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "♔" } });
    expect(
      runRandomChessPiece(randomChessPieceExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🩗" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomChessPieceValueCount },
        (_, index) =>
          calculateRandomChessPiece(
            () => (index + 0.5) / randomChessPieceValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomChessPieceValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomChessPiece({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
