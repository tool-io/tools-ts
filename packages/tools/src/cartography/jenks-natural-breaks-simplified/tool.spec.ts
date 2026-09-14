import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: {
    upperBounds: [2, 11],
    withinClassSquaredError: 1,
    classStartIndices: [0, 2],
  },
};
const close = (a: unknown, e: unknown): void => {
  if (typeof e === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - e)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(e)) * 1e-9,
    );
  } else if (Array.isArray(e)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(e.length);
    e.forEach((v, j) => close((a as unknown[])[j], v));
  } else if (e && typeof e === "object") {
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(e).sort());
    for (const [k, v] of Object.entries(e))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(e);
};
describe(tool.id, () => {
  it("matches independently specified fixture through both entrypoints", () => {
    close(calculate(example.input), expected);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes contract and matching schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
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
  it("rejects null and nonfinite observations", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(() =>
          calculate({ ...example.input, [k]: NaN } as Input),
        ).toThrow();
        expect(() =>
          calculate({ ...example.input, [k]: Infinity } as Input),
        ).toThrow();
      }
      if (Array.isArray(v)) {
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
      }
    }
  });
  it("is deterministic without mutating observations", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    close(calculate(x), expected);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("rejects explicitly unsupported evidence", () => {
    const x = { ...example.input, ...{ classes: 0 } } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
  it("rejects inherited and oversized array slots", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const a = Array(1);
        Object.setPrototypeOf(
          a,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() =>
          calculate({ ...example.input, [k]: a } as Input),
        ).toThrow();
        const huge =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: huge })).toMatchObject({
          ok: false,
        });
      }
  });
  it("advertises explicit scope without hidden inference", () => {
    expect(tool.description.length).toBeGreaterThan(30);
    close(example.output, expected);
  });
});

// batch52 domain regressions

it.each([
  [[1, 2, 3, 20, 21]],
  [[0, 0, 0, 1, 2]],
  [[-3, -2, 1, 8]],
  [[10, 11, 12]],
  [[1, 1, 1]],
  [[0, 1, 2, 3, 4, 5]],
])("matches independently exhaustive two-class partitions %j", (values) => {
  const sorted = [...values].sort((a, b) => a - b),
    sse = (v: number[]) => {
      const m = v.reduce((s, x) => s + x, 0) / v.length;
      return v.reduce((s, x) => s + (x - m) ** 2, 0);
    };
  let best = Infinity,
    split = 0;
  for (let j = 1; j < sorted.length; j++) {
    const error = sse(sorted.slice(0, j)) + sse(sorted.slice(j));
    if (error < best) {
      best = error;
      split = j;
    }
  }
  const r = calculate({ observedValues: values, classes: 2 }).result;
  expect(r.withinClassSquaredError).toBeCloseTo(best, 10);
  expect(r.classStartIndices).toEqual([0, split]);
  expect(r.upperBounds).toEqual([sorted[split - 1], sorted.at(-1)]);
});
it("handles large-offset data without subtracting prefix-square cancellation", () =>
  expect(
    calculate({
      observedValues: [1e12, 1e12 + 1, 1e12 + 100, 1e12 + 101],
      classes: 2,
    }).result.withinClassSquaredError,
  ).toBe(1));
it("rejects unbounded quadratic work", () =>
  expect(() =>
    calculate({ observedValues: Array(129).fill(1), classes: 2 }),
  ).toThrow());
