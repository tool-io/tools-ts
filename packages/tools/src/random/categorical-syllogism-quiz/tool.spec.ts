import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateCategoricalSyllogismQuiz as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("keeps unsupported-form answer labels caller-provided, including unknowns", () => {
    expect(
      calculate({
        ...example.input,
        answerBank: [
          {
            syllogism: "AAI-1",
            modernValidity: "invalid",
            nonemptyValidity: "valid",
          },
        ],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            syllogism: "AAI-1",
            majorPremise: "All M-items are P-items.",
            minorPremise: "All S-items are M-items.",
            conclusion: "Some S-items are P-items.",
            modernValidity: "invalid",
            nonemptyValidity: "valid",
            answerSource: "supplied-bank",
          },
        ],
      },
    });
    expect(
      calculate({
        ...example.input,
        answerBank: [
          {
            syllogism: "OOO-2",
            modernValidity: "unknown",
            nonemptyValidity: "unknown",
          },
        ],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            modernValidity: "unknown",
            nonemptyValidity: "unknown",
            answerSource: "supplied-bank",
          },
        ],
      },
    });
    // Explicit modern countermodel for the supplied AAI-1 key: S empty, M=P={u}.
    const S: readonly string[] = [],
      M = ["u"],
      P = ["u"];
    expect(M.every((x) => P.includes(x)) && S.every((x) => M.includes(x))).toBe(
      true,
    );
    expect(S.some((x) => P.includes(x))).toBe(false);
  });
  it("independently proves the two named universal forms over finite membership models", () => {
    for (let s = 0; s < 4; s += 1)
      for (let m = 0; m < 4; m += 1)
        for (let p = 0; p < 4; p += 1) {
          if ((s & ~m) === 0 && (m & ~p) === 0) expect(s & ~p).toBe(0);
          if ((s & ~m) === 0 && (m & p) === 0) expect(s & p).toBe(0);
        }
    expect(
      calculate({
        ...example.input,
        answerBank: [
          {
            syllogism: "AAA-1",
            modernValidity: "unknown",
            nonemptyValidity: "unknown",
          },
        ],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            modernValidity: "valid",
            nonemptyValidity: "valid",
            answerSource: "barbara-core",
          },
        ],
      },
    });
  });
  it("rejects conflicting supported keys, duplicates, missing review, newline tokens, and excess cards", () => {
    expect(
      calculate({
        ...example.input,
        answerBank: [
          {
            syllogism: "AAA-1",
            modernValidity: "invalid",
            nonemptyValidity: "valid",
          },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "answerBank", code: "reviewed_key_conflict" }],
      },
    });
    expect(
      calculate({
        ...example.input,
        answerBank: [example.input.answerBank[0], example.input.answerBank[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "answerBank", code: "duplicate_entry" }] },
    });
    expect(
      tool.execute({ ...example.input, callerVerified: false }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "callerVerified", code: "invalid_field" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        answerBank: [
          {
            syllogism: "AAA-1\n",
            modernValidity: "valid",
            nonemptyValidity: "valid",
          },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "answerBank", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
