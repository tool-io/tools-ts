import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateFallacySpottingCards as calculate,
  type FallacyCardKind,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
const holds = (formula: string, p: boolean, q: boolean): boolean => {
  if (formula === "(p -> q)") return !p || q;
  if (formula === "p") return p;
  if (formula === "q") return q;
  if (formula === "!p") return !p;
  if (formula === "!q") return !q;
  throw new Error("Unexpected formal template");
};
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("verifies fallacy countervaluations and valid controls independently of delegated detectors", () => {
    const kinds: readonly FallacyCardKind[] = [
      "affirming-consequent",
      "denying-antecedent",
      "modus-ponens",
      "modus-tollens",
    ];
    for (const kind of kinds) {
      const result = calculate({ ...example.input, kinds: [kind], count: 4 });
      if (!result.ok) throw new Error("Expected cards");
      for (const card of result.output.cards) {
        const counterexamples = [
          [false, false],
          [false, true],
          [true, false],
          [true, true],
        ].filter(
          ([p, q]) =>
            card.premises.every((formula) => holds(formula, p, q)) &&
            !holds(card.conclusion, p, q),
        );
        expect(card.formallyValid).toBe(counterexamples.length === 0);
        if (card.counterexample) {
          const { p, q } = card.counterexample;
          expect(card.premises.every((formula) => holds(formula, p, q))).toBe(
            true,
          );
          expect(holds(card.conclusion, p, q)).toBe(false);
        } else expect(card.formallyValid).toBe(true);
        expect(example.input.statements).toContain(card.statementP);
        expect(example.input.statements).toContain(card.statementQ);
        expect(card.statementP).not.toBe(card.statementQ);
      }
    }
  });
  it("keeps statement truth separate from formal validity and rejects malformed banks", () => {
    expect(
      calculate({
        ...example.input,
        statements: ["A caller's first sentence", "A caller's second sentence"],
        kinds: ["modus-tollens"],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          { label: "modus-tollens", formallyValid: true, counterexample: null },
        ],
      },
    });
    expect(
      calculate({ ...example.input, statements: ["same", "same"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "statements", code: "duplicate_entry" }] },
    });
    expect(
      calculate({ ...example.input, kinds: ["modus-ponens", "modus-ponens"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "kinds", code: "duplicate_entry" }] },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
