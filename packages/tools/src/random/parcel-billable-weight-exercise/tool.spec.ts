import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import base from "../../logistics/dimensional-weight-divisor-calculator/tool.js";
describe(tool.id, () => {
  it("computes independent canonical draws and composes imported answers", () => {
    const cases = example.input.candidateInputsJson.map(
      (v) => JSON.parse(v) as Record<string, unknown>,
    );
    const expected = base.execute(cases[0], { random: () => 0.5 });
    expect(expected.ok).toBe(true);
    const actual = calculate(example.input, { random: () => 0 });
    expect(actual.result).toMatchObject({
      selectedCandidateIndices: [0],
      unusedCandidateIndices: [],
      baseToolId: base.id,
    });
    if (expected.ok)
      expect(
        (actual.result as { exercises: { answer: unknown }[] }).exercises[0]
          .answer,
      ).toEqual(expected.output);
    expect(calculate(example.input, { random: () => 0 }).result).toMatchObject({
      exercises: [
        {
          actualWeightKg: 10,
          unroundedBillableWeightKg: 19.2,
          callerRoundedBillableWeightKg: 19.5,
        },
      ],
    });
  });
  it("publishes portable schemas and valid contracts", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
  });
  it("is seeded reproducible and leaves caller input unchanged", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    expect(calculate(input)).toEqual(calculate(input));
    expect(JSON.stringify(input)).toBe(before);
    expect(tool.execute(input)).toEqual(tool.execute(input));
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite inputs", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
    }
  });
  it("rejects infeasible domains and invalid seeds", () => {
    const bad = { ...example.input, count: 0 };
    expect(() => calculate(bad as unknown as Input)).toThrow();
    expect(tool.execute(bad)).toMatchObject({ ok: false });
    for (const seed of ["", " ", "a".repeat(257)])
      expect(tool.execute({ ...example.input, seed })).toMatchObject({
        ok: false,
      });
  });
  it("rejects invalid supplied randomness and bounds count", () => {
    for (const value of [NaN, Infinity, -0.1, 1]) {
      expect(() => calculate(example.input, { random: () => value })).toThrow();
      expect(
        tool.execute(example.input, { random: () => value }),
      ).toMatchObject({ ok: false });
    }
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
    });
    expect(tool.execute({ ...example.input, count: 1.5 })).toMatchObject({
      ok: false,
    });
  });
  it("preserves one advancing source across multiple draws", () => {
    let calls = 0;
    const result = calculate(
      { ...example.input, count: 2, withoutReplacement: false },
      {
        random: () => {
          calls++;
          return calls % 2 ? 0.1 : 0.9;
        },
      },
    );
    expect(calls).toBeGreaterThanOrEqual(2);
    expect(result.result).toBeDefined();
  });
  it("bounds arrays and rejects missing inherited entries", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
        expect(
          tool.execute({ ...example.input, [k]: Array(129).fill(v[0]) }),
        ).toMatchObject({ ok: false });
      }
  });
  it("rejects malformed, dangerous, invalid undrawn or oversized candidate inputs", () => {
    for (const s of [
      "null",
      "[]",
      "{",
      '{"x":1e999}',
      '{"__proto__":{}}',
      "x".repeat(8193),
    ])
      expect(
        tool.execute({ ...example.input, candidateInputsJson: [s] }),
      ).toMatchObject({ ok: false });
    expect(
      tool.execute(
        {
          ...example.input,
          candidateInputsJson: [
            ...example.input.candidateInputsJson,
            '{"unknown":true}',
          ],
        },
        { random: () => 0 },
      ),
    ).toMatchObject({ ok: false });
    expect(
      tool.execute({ ...example.input, count: 2, withoutReplacement: true }),
    ).toMatchObject({ ok: false });
  });
});
