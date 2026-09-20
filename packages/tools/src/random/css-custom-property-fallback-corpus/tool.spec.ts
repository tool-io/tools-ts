import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cssCustomPropertyFallbackCorpusExample as example,
  calculateCssCustomPropertyFallbackCorpus,
} from "./tool.js";

describe("random/css-custom-property-fallback-corpus", () => {
  it("rejects trailing line terminators in literal tokens", () => {
    for (const token of ["blue\n", "red\r\n"])
      expect(
        tool.execute({ ...example.input, literalTokens: [token] }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "literalTokens" }] },
      });
  });
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateCssCustomPropertyFallbackCorpus(example.input),
      tool.execute(example.input),
    ]) {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      expect(result.output).toEqual(example.output);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves input, replays seeds, and gives an explicit seed precedence", () => {
    const input = JSON.parse(JSON.stringify(example.input));
    const before = JSON.stringify(input);
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(JSON.stringify(input)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual(tool.execute(example.input));
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const result = tool.execute(unseeded, { random: () => 0.5 });
    if (!result.ok) throw new Error(JSON.stringify(result.error));
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("returns stable malformed-input and checked-source failures", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    expect(missing).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    if (missing.ok)
      throw new Error("Expected every required-field diagnostic.");
    const requiredFields = [
      "count",
      "depth",
      "literalTokens",
      "bindingProbability",
    ];
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ field, code: "required_field" })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("independently selects the first bound nested variable or final literal", () => {
    for (const probability of [0, 0.5, 1]) {
      const r = tool.execute({
        ...example.input,
        bindingProbability: probability,
      });
      if (!r.ok) throw new Error("Expected corpus");
      for (const c of r.output.cases) {
        const names = c.expression.match(/--v[0-9]+/g) ?? [];
        const first = names
          .map((n) => c.parsedBindings.find((b) => b.name === n)?.value)
          .find((v) => v !== undefined);
        const terminal = c.expression
          .slice(c.expression.lastIndexOf(", ") + 2)
          .replace(/\)+$/, "");
        expect(c.resolvedToken).toBe(first ?? terminal);
        if (probability === 0) expect(c.visitedVariables).toHaveLength(3);
      }
    }
  });
  it("rejects unsafe literal syntax and depth resources", () => {
    expect(
      tool.execute({ ...example.input, literalTokens: ["var(--x)"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "literalTokens" }] },
    });
    expect(
      tool.execute({ ...example.input, depth: { minimum: 9, maximum: 9 } }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "depth" }] },
    });
  });
});
