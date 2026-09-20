import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateMastermindRoundDataset as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("reserves exact duplicate matches before misplaced matches", () => {
    const draws = [0.25, 0.25, 0.5, 0.75, 0.25, 0.5, 0.25, 0.25];
    let i = 0;
    expect(
      calculate(
        { codeLength: 4, symbolCount: 4, allowRepetition: true, guessCount: 1 },
        { random: () => draws[i++] ?? 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        secret: [1, 1, 2, 3],
        rounds: [
          {
            guess: [1, 2, 1, 1],
            feedback: {
              blackExactPegs: 1,
              whiteMisplacedPegs: 2,
              perPositionFeedback: [2, 1, 1, 0],
            },
          },
        ],
      },
    });
  });
  it("independently checks multiset peg counts and distinct-code rules", () => {
    for (const allowRepetition of [true, false]) {
      const result = calculate({
        codeLength: 5,
        symbolCount: 6,
        allowRepetition,
        guessCount: 20,
        seed: 7,
      });
      if (!result.ok) throw new Error("Expected rounds");
      if (!allowRepetition) expect(new Set(result.output.secret).size).toBe(5);
      for (const round of result.output.rounds) {
        const exact = round.guess.filter(
          (v, i) => v === result.output.secret[i],
        ).length;
        const total = Array.from({ length: 6 }, (_, symbol) =>
          Math.min(
            result.output.secret.filter((v) => v === symbol).length,
            round.guess.filter((v) => v === symbol).length,
          ),
        ).reduce((a, b) => a + b, 0);
        expect(round.feedback.blackExactPegs).toBe(exact);
        expect(round.feedback.whiteMisplacedPegs).toBe(total - exact);
        if (!allowRepetition) expect(new Set(round.guess).size).toBe(5);
      }
    }
  });
  it("rejects impossible distinct codes and excessive rounds", () => {
    expect(
      calculate({
        codeLength: 5,
        symbolCount: 4,
        allowRepetition: false,
        guessCount: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "codeLength", code: "insufficient_symbols" }],
      },
    });
    expect(tool.execute({ ...example.input, guessCount: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "guessCount", code: "invalid_field" }] },
    });
  });
});
