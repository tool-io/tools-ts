import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateInferenceRuleProofCards as calculate,
  type ProofCardRule,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";

const evaluate = (
  formula: string,
  valuation: Readonly<Record<string, boolean>>,
): boolean => {
  const conditional = /^\(([a-z][0-9]+) -> ([a-z][0-9]+)\)$(?![\s\S])/.exec(
    formula,
  );
  if (conditional)
    return !valuation[conditional[1]] || valuation[conditional[2]];
  return formula.startsWith("!")
    ? !valuation[formula.slice(1)]
    : valuation[formula];
};
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("independently truth-checks every generated argument and its controlled invalid conclusion", () => {
    const rules: readonly ProofCardRule[] = [
      "modus-ponens",
      "modus-tollens",
      "hypothetical-syllogism",
    ];
    for (const rule of rules) {
      const result = calculate({
        rules: [rule],
        count: 12,
        invalidCount: 5,
        seed: 17,
      });
      if (!result.ok) throw new Error("Expected cards");
      expect(
        result.output.cards.filter((card) => !card.matchesRule),
      ).toHaveLength(5);
      for (const card of result.output.cards) {
        const atoms = [
          ...new Set(
            [...card.premises, card.conclusion]
              .join(" ")
              .match(/[pqrx][0-9]+/g) ?? [],
          ),
        ];
        const countervaluations = Array.from(
          { length: 2 ** atoms.length },
          (_, mask) =>
            Object.fromEntries(
              atoms.map((atom, i) => [atom, (mask & (2 ** i)) !== 0]),
            ),
        ).filter(
          (valuation) =>
            card.premises.every((p) => evaluate(p, valuation)) &&
            !evaluate(card.conclusion, valuation),
        );
        expect(card.matchesRule).toBe(countervaluations.length === 0);
      }
    }
  });
  it("uses fresh atoms and keeps the ordinary MP reference case", () => {
    expect(
      calculate(
        { rules: ["modus-ponens"], count: 1, invalidCount: 0 },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            premises: ["(p1 -> q1)", "p1"],
            conclusion: "q1",
            matchesRule: true,
          },
        ],
      },
    });
    expect(
      calculate(
        { rules: ["hypothetical-syllogism"], count: 1, invalidCount: 1 },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            premises: ["(p1 -> q1)", "(q1 -> r1)"],
            conclusion: "(p1 -> x1)",
            matchesRule: false,
          },
        ],
      },
    });
    expect(
      evaluate("(p1 -> x1)", { p1: true, q1: true, r1: true, x1: false }),
    ).toBe(false);
  });
  it("rejects duplicate templates, impossible counts, and resource excess", () => {
    expect(
      calculate({ ...example.input, rules: ["modus-ponens", "modus-ponens"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rules", code: "duplicate_entry" }] },
    });
    expect(calculate({ ...example.input, invalidCount: 3 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "invalidCount", code: "infeasible_invalid_count" }],
      },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
