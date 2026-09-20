import { describe, expect, it } from "vitest";
import tool, {
  example,
  calculateExistentialImportCounterexampleCards as calculate,
} from "./index.js";
import { puzzleContractSpecs } from "../m250-puzzles-logic-spec-support.js";
describe(tool.id, () => {
  puzzleContractSpecs(tool, example, calculate);
  it("independently evaluates universal premises and false particular conclusions in every finite model", () => {
    for (const template of ["AAI-1", "EAO-1"] as const) {
      const result = calculate({
        templates: [template],
        universeSize: 8,
        count: 32,
        seed: 19,
      });
      if (!result.ok) throw new Error("Expected countermodels");
      for (const card of result.output.cards) {
        const { S, M, P } = card.sets;
        expect(card.universe).toHaveLength(8);
        for (const set of [S, M, P]) {
          expect(new Set(set).size).toBe(set.length);
          expect(set.every((element) => card.universe.includes(element))).toBe(
            true,
          );
        }
        const major =
            template === "AAI-1"
              ? M.every((element) => P.includes(element))
              : M.every((element) => !P.includes(element)),
          minor = S.every((element) => M.includes(element)),
          conclusion =
            template === "AAI-1"
              ? S.some((element) => P.includes(element))
              : S.some((element) => !P.includes(element));
        expect([major, minor, conclusion]).toEqual([true, true, false]);
        expect([
          card.majorPremiseTrue,
          card.minorPremiseTrue,
          card.conclusionTrue,
        ]).toEqual([major, minor, conclusion]);
        expect(card.isCounterexample).toBe(major && minor && !conclusion);
        expect(S).toEqual([]);
      }
    }
  });
  it("constructs both empty and nonempty middle predicates without precomputed model selection", () => {
    expect(
      calculate(
        { templates: ["AAI-1"], universeSize: 2, count: 1 },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [{ sets: { S: [], M: [], P: [] }, isCounterexample: true }],
      },
    });
    expect(
      calculate(
        { templates: ["AAI-1"], universeSize: 2, count: 1 },
        { random: () => 0.99 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            sets: { S: [], M: ["u1", "u2"], P: ["u1", "u2"] },
            isCounterexample: true,
          },
        ],
      },
    });
    expect(
      calculate(
        { templates: ["EAO-1"], universeSize: 2, count: 1 },
        { random: () => 0.99 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        cards: [
          { sets: { S: [], M: ["u1", "u2"], P: [] }, isCounterexample: true },
        ],
      },
    });
  });
  it("rejects duplicate templates, an empty universe, and bounded output excess", () => {
    expect(
      calculate({ ...example.input, templates: ["AAI-1", "AAI-1"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "templates", code: "duplicate_entry" }] },
    });
    expect(tool.execute({ ...example.input, universeSize: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "universeSize", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
});
