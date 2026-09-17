import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { permutation: [2, 0, 1] } };
describe(tool.id, () => {
  it("computes independently specified fixture", () =>
    expect(calculate(example.input)).toEqual(expected));
  it("executes the fixture", () =>
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: expected,
    }));
  it("has a valid contract", () =>
    expect(validateToolContract(tool)).toEqual([]));
  it("has matching input and output schemas", () => {
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null fields", () => {
    for (const k of Object.keys(example.input))
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
  });
  it("rejects mismatched types", () => {
    for (const [k, v] of Object.entries(example.input))
      expect(
        tool.execute({
          ...example.input,
          [k]: typeof v === "string" ? 1 : typeof v === "number" ? "1" : null,
        }),
      ).toMatchObject({ ok: false });
  });
  it("rejects nonfinite and sparse numeric evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v)) {
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
        if (typeof v[0] === "number")
          expect(() =>
            calculate({ ...example.input, [k]: [NaN] } as Input),
          ).toThrow();
      }
    }
  });
  it("does not mutate callers", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    calculate(x);
    expect(JSON.stringify(x)).toBe(before);
    expect(calculate(x)).toEqual(calculate(x));
  });
  it("publishes a truthful example", () =>
    expect(example.output).toEqual(expected));
  it("enforces text and collection budgets", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "string")
        expect(() =>
          calculate({ ...example.input, [k]: "x".repeat(8193) } as Input),
        ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(129).fill(v[0]) } as Input),
        ).toThrow();
    }
  });
  it("rejects invalid domain evidence", () => {
    const x = { ...example.input, ...{ rank: "6" } } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
});

// Batch 54 domain regressions
it("rejects a final newline in a strict lexical field rank", () => {
  const x = { size: 3, rank: "4\n" } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
});
it("matches exhaustive size-three permutation oracle 0", () => {
  expect(calculate({ size: 3, rank: "0" } as Input)).toEqual({
    result: { permutation: [0, 1, 2] },
  });
});
it("matches exhaustive size-three permutation oracle 1", () => {
  expect(calculate({ size: 3, rank: "1" } as Input)).toEqual({
    result: { permutation: [0, 2, 1] },
  });
});
it("matches exhaustive size-three permutation oracle 2", () => {
  expect(calculate({ size: 3, rank: "2" } as Input)).toEqual({
    result: { permutation: [1, 0, 2] },
  });
});
it("matches exhaustive size-three permutation oracle 3", () => {
  expect(calculate({ size: 3, rank: "3" } as Input)).toEqual({
    result: { permutation: [1, 2, 0] },
  });
});
it("matches exhaustive size-three permutation oracle 4", () => {
  expect(calculate({ size: 3, rank: "4" } as Input)).toEqual({
    result: { permutation: [2, 0, 1] },
  });
});
it("matches exhaustive size-three permutation oracle 5", () => {
  expect(calculate({ size: 3, rank: "5" } as Input)).toEqual({
    result: { permutation: [2, 1, 0] },
  });
});
