import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateSlidingTileScramble as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("independently replays every tile swap and reverses the scramble to the caller's solved grid", () => {
    const result = calculate({
      solvedBoard: [
        [1, 2, 3],
        [4, 5, 0],
      ],
      moveCount: 100,
      seed: 9,
    });
    if (!result.ok) throw new Error("Expected legal scramble");
    const flat = result.output.initialBoard.flat();
    let blank = flat.indexOf(0);
    for (const move of result.output.moves) {
      expect(move.blankFrom).toBe(blank);
      const manhattan =
        Math.abs(Math.floor(blank / 3) - Math.floor(move.blankTo / 3)) +
        Math.abs((blank % 3) - (move.blankTo % 3));
      expect(manhattan).toBe(1);
      expect(move.tile).toBe(flat[move.blankTo]);
      flat[blank] = flat[move.blankTo];
      flat[move.blankTo] = 0;
      blank = move.blankTo;
      expect(move.board.flat()).toEqual(flat);
    }
    expect(result.output.finalBoard.flat()).toEqual(flat);
    for (const direction of result.output.inverseMoves) {
      const next = blank + { up: -3, down: 3, left: -1, right: 1 }[direction];
      flat[blank] = flat[next];
      flat[next] = 0;
      blank = next;
    }
    expect(flat).toEqual([1, 2, 3, 4, 5, 0]);
  });
  it("supports zero moves and rejects malformed or oversized boards and traces", () => {
    expect(calculate({ ...example.input, moveCount: 0 })).toMatchObject({
      ok: true,
      output: {
        moves: [],
        inverseMoves: [],
        finalBoard: [
          [1, 2],
          [3, 0],
        ],
      },
    });
    expect(
      calculate({
        ...example.input,
        solvedBoard: [
          [1, 2],
          [2, 0],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "solvedBoard", code: "duplicate_entry" }] },
    });
    expect(
      calculate({
        ...example.input,
        solvedBoard: [
          [1, 2],
          [3, 4],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "solvedBoard", code: "missing_blank" }] },
    });
    expect(
      calculate({
        ...example.input,
        solvedBoard: [
          [1, 2],
          [3, 4, 0],
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_board_shape" }] },
    });
    expect(tool.execute({ ...example.input, moveCount: 129 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "moveCount", code: "invalid_field" }] },
    });
  });
});
