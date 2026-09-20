import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  constraintSatisfactionInstanceExample as example,
  calculateConstraintSatisfactionInstance,
} from "./tool.js";
const smallInput = {
  variableCount: 2,
  domainSize: 1,
  constraintCount: 1,
  allowedTupleProbability: 0,
  seed: 42,
} as const;

describe("Random Binary Constraint Satisfaction Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateConstraintSatisfactionInstance(example.input)).toEqual({
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
  it("checks the planted witness, tuple domains, unique pairs and probability endpoints", () => {
    for (const probability of [0, 0.4, 1])
      for (let seed = 0; seed < 8; seed += 1) {
        const result = tool.execute({
          variableCount: 6,
          domainSize: 3,
          constraintCount: 9,
          allowedTupleProbability: probability,
          seed,
        });
        if (!result.ok) throw new Error("Expected success");
        const out = result.output;
        expect(out.constraints).toHaveLength(9);
        expect(
          new Set(out.constraints.map((c) => c.variables.join(","))).size,
        ).toBe(9);
        for (const c of out.constraints) {
          const [a, b] = c.variables;
          expect(a).toBeLessThan(b);
          expect(b).toBeLessThan(6);
          expect(c.allowedTuples).toContainEqual([
            out.satisfyingAssignment[a],
            out.satisfyingAssignment[b],
          ]);
          for (const tuple of c.allowedTuples)
            for (const value of tuple) expect([0, 1, 2]).toContain(value);
          expect(new Set(c.allowedTuples.map((t) => t.join(","))).size).toBe(
            c.allowedTuples.length,
          );
          if (probability === 0) expect(c.allowedTuples).toHaveLength(1);
          if (probability === 1) expect(c.allowedTuples).toHaveLength(9);
        }
      }
    const empty = tool.execute({ ...smallInput, constraintCount: 0 });
    if (!empty.ok) throw new Error("Expected success");
    expect(empty.output.constraints).toEqual([]);
  });
  it("rejects impossible pair counts and excessive tuple work", () => {
    expect(tool.execute({ ...smallInput, constraintCount: 2 })).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "constraintCount", code: "infeasible_constraint_count" },
        ],
      },
    });
    expect(
      tool.execute({
        ...smallInput,
        variableCount: 32,
        domainSize: 16,
        constraintCount: 128,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "constraintCount", code: "resource_limit" }] },
    });
  });
});
