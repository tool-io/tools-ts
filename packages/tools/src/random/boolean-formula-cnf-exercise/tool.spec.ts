import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  booleanFormulaCnfExerciseExample as example,
  calculateBooleanFormulaCnfExercise,
} from "./tool.js";

describe("Random Boolean Formula to CNF Exercise Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateBooleanFormulaCnfExercise(example.input)).toEqual({
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
  it("is existentially equivalent to its generated formula for every small named-variable assignment", () => {
    const evaluate = (
      node: unknown,
      values: Readonly<Record<string, boolean>>,
    ): boolean => {
      if (typeof node !== "object" || node === null || !("op" in node))
        throw new Error("Expected a formula node.");
      if (node.op === "var") {
        if (
          !("name" in node) ||
          typeof node.name !== "string" ||
          !Object.hasOwn(values, node.name)
        )
          throw new Error("Expected a known variable.");
        return values[node.name];
      }
      if (node.op === "not") {
        if (!("arg" in node)) throw new Error("Expected a negation argument.");
        return !evaluate(node.arg, values);
      }
      if (node.op === "and" || node.op === "or") {
        if (!("args" in node) || !Array.isArray(node.args))
          throw new Error("Expected connective arguments.");
        return node.op === "and"
          ? node.args.every((arg: unknown) => evaluate(arg, values))
          : node.args.some((arg: unknown) => evaluate(arg, values));
      }
      if (node.op !== "implies" || !("left" in node) || !("right" in node))
        throw new Error("Expected implication operands.");
      return !evaluate(node.left, values) || evaluate(node.right, values);
    };
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...example.input,
        operatorCount: 3,
        maximumDepth: 3,
        operators: ["not", "and", "or", "implies"],
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (let assignment = 0; assignment < 4; assignment += 1) {
        const values = {
          a: Boolean(assignment & 1),
          b: Boolean(assignment & 2),
        };
        let extensionExists = false;
        for (
          let mask = 0;
          mask < 2 ** result.output.totalVariableCount;
          mask += 1
        ) {
          if (
            !result.output.namedVariables.every(
              ({ name, id }) =>
                Boolean(mask & (2 ** (id - 1))) === values[name as "a" | "b"],
            )
          )
            continue;
          if (
            result.output.clauses.every((clause) =>
              clause.some(
                (literal) =>
                  Boolean(mask & (2 ** (Math.abs(literal) - 1))) ===
                  literal > 0,
              ),
            )
          )
            extensionExists = true;
        }
        expect(extensionExists).toBe(
          evaluate(JSON.parse(result.output.formulaJson), values),
        );
      }
    }
  });
  it("honors exact operator counts, depth capacity, repeated variables, and all supported operators", () => {
    const result = tool.execute({
      variableNames: ["x"],
      operators: ["not"],
      operatorCount: 4,
      maximumDepth: 4,
      seed: 42,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(
        (result.output.formulaJson.match(/"op":"not"/g) ?? []).length,
      ).toBe(4);
      expect(result.output.namedVariables).toHaveLength(1);
    }
    expect(tool.execute({ ...example.input, operatorCount: 0 })).toMatchObject({
      ok: true,
      output: { clauses: [[1]], totalVariableCount: 1 },
    });
    expect(
      tool.execute({
        ...example.input,
        operators: ["not"],
        operatorCount: 3,
        maximumDepth: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "infeasible_formula_size" }] },
    });
  });
  it("rejects malformed variable identifiers, duplicate choices, unsupported operators, and resource excess", () => {
    for (const change of [
      { variableNames: ["a\n"] },
      { variableNames: ["a", "a"] },
      { operators: ["xor"] },
      { operators: ["and", "and"] },
      { operatorCount: 25 },
      { maximumDepth: 0 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
