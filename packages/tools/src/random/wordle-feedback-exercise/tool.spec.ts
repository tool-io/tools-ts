import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateWordleFeedbackExercise as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("matches an independently known duplicate-letter feedback and can expose the secret", () => {
    expect(
      calculate(
        {
          answers: ["apple"],
          guesses: ["alley"],
          provenance: "Illustrative words",
          guessCount: 1,
          hideSecret: false,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: {
          answerWord: "apple",
          rounds: [
            {
              guess: "alley",
              feedback: {
                feedbackCodes: [2, 1, 0, 1, 0],
                feedbackPattern: "21010",
              },
            },
          ],
        },
        answer: { answerWord: "apple" },
      },
    });
    expect(
      calculate({
        ...example.input,
        answers: ["apple"],
        guesses: ["ppppp"],
        guessCount: 1,
        hideSecret: false,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        puzzle: {
          rounds: [
            {
              feedback: {
                feedbackCodes: [0, 2, 2, 0, 0],
                feedbackPattern: "02200",
              },
            },
          ],
        },
      },
    });
  });
  it("rejects unequal lengths, duplicated bank identities, and exact-end ASCII violations", () => {
    expect(calculate({ ...example.input, guesses: ["cat"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "guesses", code: "word_length_mismatch" }] },
    });
    expect(
      calculate({ ...example.input, answers: ["apple", "apple"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "answers", code: "duplicate_entry" }] },
    });
    for (const word of ["apple\n", "Apple", "äpple", "apple\r\n"])
      expect(tool.execute({ ...example.input, answers: [word] })).toMatchObject(
        {
          ok: false,
          error: { issues: [{ field: "answers", code: "invalid_field" }] },
        },
      );
    expect(tool.execute({ ...example.input, guesses: Array(2) })).toMatchObject(
      {
        ok: false,
        error: { issues: [{ field: "guesses", code: "invalid_field" }] },
      },
    );
    expect(tool.execute({ ...example.input, guessCount: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "guessCount", code: "invalid_field" }] },
    });
  });
});
