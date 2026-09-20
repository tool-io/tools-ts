import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateSetTripleRecognitionQuiz as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("constructs a guaranteed number of distinct-card distractors and independently audits modular feature sums", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = calculate({ count: 32, invalidCount: 11, seed });
      if (!result.ok) throw new Error("Expected triples");
      expect(result.output.questions.filter((q) => !q.validSet)).toHaveLength(
        11,
      );
      for (const question of result.output.questions) {
        expect(new Set(question.cards.map((card) => card.join(","))).size).toBe(
          3,
        );
        const flags = Array.from({ length: 4 }, (_, feature) =>
          question.cards.reduce((sum, card) => sum + card[feature], 0) % 3 === 0
            ? 1
            : 0,
        );
        expect(question.featureFlags).toEqual(flags);
        expect(question.validSet).toBe(flags.every((flag) => flag === 1));
        if (!question.validSet)
          expect(flags.filter((flag) => flag === 0)).toHaveLength(1);
      }
    }
  });
  it("supports all-valid and all-invalid endpoints and rejects infeasible counts", () => {
    expect(
      calculate({ count: 1, invalidCount: 0 }, { random: () => 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        questions: [
          {
            cards: [
              [0, 0, 0, 0],
              [0, 0, 0, 1],
              [0, 0, 0, 2],
            ],
            validSet: true,
            featureFlags: [1, 1, 1, 1],
          },
        ],
      },
    });
    expect(calculate({ count: 1, invalidCount: 2 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "invalidCount", code: "infeasible_invalid_count" }],
      },
    });
    expect(tool.execute({ count: 65, invalidCount: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
