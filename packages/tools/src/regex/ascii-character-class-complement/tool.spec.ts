import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { codes: [126, 127] } };
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
    const x = { ...example.input, ...{ codes: [128] } } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
});

// Batch 54 domain regressions
it("covers an independently specified boundary", () => {
  expect(
    calculate({
      codes: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
        74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
        92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
        108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
        122, 123, 124, 125, 126, 127,
      ],
    } as Input),
  ).toEqual({ result: { codes: [] } });
});
