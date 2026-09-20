import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  maxSatInstanceExample as example,
  calculateMaxSatInstance,
} from "./tool.js";
const smallInput = {
  variableCount: 1,
  clauseCount: 1,
  literalsPerClause: 1,
  seed: 42,
} as const;

describe("Random Unweighted Max-SAT Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMaxSatInstance(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("uses valid signed distinct variables and scores the sampled assignment independently", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        variableCount: 8,
        clauseCount: 30,
        literalsPerClause: 3,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        satisfied: number[] = [];
      out.clauses.forEach((clause, index) => {
        expect(clause).toHaveLength(3);
        expect(new Set(clause.map(Math.abs)).size).toBe(3);
        let truth = false;
        for (const literal of clause) {
          expect(Math.abs(literal)).toBeGreaterThanOrEqual(1);
          expect(Math.abs(literal)).toBeLessThanOrEqual(8);
          truth ||=
            literal > 0
              ? out.assignment[literal - 1]
              : !out.assignment[-literal - 1];
        }
        if (truth) satisfied.push(index);
      });
      expect(out.satisfiedClauses).toEqual(satisfied);
      expect(out.score).toBe(satisfied.length);
    }
  });
  it("retains contradictory unit clauses instead of promising satisfiability", () => {
    const draws = [0.9, 0.1, 0.1];
    let i = 0;
    const result = tool.execute(
      { variableCount: 1, clauseCount: 2, literalsPerClause: 1 },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.clauses).toEqual([[1], [-1]]);
    expect(result.output.score).toBe(1);
    expect(tool.execute({ ...smallInput, literalsPerClause: 2 })).toMatchObject(
      { ok: false, error: { issues: [{ field: "literalsPerClause" }] } },
    );
    expect(
      tool.execute({
        variableCount: 64,
        clauseCount: 256,
        literalsPerClause: 64,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
  });
});
