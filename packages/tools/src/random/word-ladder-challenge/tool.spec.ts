import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateWordLadderChallenge as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("preserves alternative shortest paths and delegates a stable lexical tie break", () => {
    const result = calculate(
      {
        words: ["cat", "cot", "dat", "dot"],
        minimumSteps: 2,
        provenance: "Caller test bank",
      },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        puzzle: { start: "cat", target: "dot" },
        answer: { shortestPath: ["cat", "cot", "dot"], steps: 2 },
        eligiblePairCount: 2,
      },
    });
    // Both paths have two substitutions and no one-edge path exists (two letters differ).
    for (const path of [
      ["cat", "cot", "dot"],
      ["cat", "dat", "dot"],
    ])
      for (let i = 1; i < path.length; i += 1)
        expect(
          [...path[i]].filter((letter, j) => letter !== path[i - 1][j]),
        ).toHaveLength(1);
  });
  it("distinguishes proven bank disconnection or minimum-distance infeasibility from resource rejection", () => {
    expect(
      calculate({
        words: ["cat", "dog"],
        minimumSteps: 1,
        provenance: "Disconnected bank",
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "minimumSteps", code: "no_eligible_ladder" }],
      },
    });
    expect(calculate({ ...example.input, minimumSteps: 4 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "no_eligible_ladder" }] },
    });
    expect(
      tool.execute({ ...example.input, words: Array(65).fill("cat") }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "words", code: "invalid_field" }] },
    });
    expect(
      calculate({ ...example.input, words: ["cat", "cat"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "words", code: "duplicate_entry" }] },
    });
    expect(
      calculate({ ...example.input, words: ["cat", "cats"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "word_length_mismatch" }] },
    });
    expect(
      tool.execute({ ...example.input, words: ["cat\n", "dog\n"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "words", code: "invalid_field" }] },
    });
  });
});
