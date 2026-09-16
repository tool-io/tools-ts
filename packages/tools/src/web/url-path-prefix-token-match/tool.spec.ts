import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { matches: false } };
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-9,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, j) => close((actual as unknown[])[j], v));
  } else if (expected && typeof expected === "object") {
    expect(actual !== null && typeof actual === "object").toBe(true);
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("matches independently specified fixture through both entrypoints", () => {
    close(calculate(example.input), expected);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes a valid contract and matching schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own explicit fields and rejects extras", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null and nonfinite typed evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v) && typeof v[0] === "number")
        expect(() =>
          calculate({ ...example.input, [k]: [NaN] } as Input),
        ).toThrow();
    }
  });
  it("does not mutate caller inputs and is reproducible", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    close(calculate(x), expected);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("rejects sparse and inherited array slots", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
        const a = Array(1);
        Object.setPrototypeOf(
          a,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() =>
          calculate({ ...example.input, [k]: a } as Input),
        ).toThrow();
      }
  });
  it("rejects a field type mismatch without a crash", () => {
    for (const [k, v] of Object.entries(example.input)) {
      const bad =
        typeof v === "string"
          ? 42
          : typeof v === "boolean"
            ? "false"
            : typeof v === "number"
              ? "1"
              : false;
      expect(tool.execute({ ...example.input, [k]: bad })).toMatchObject({
        ok: false,
      });
    }
  });
  it("documents restricted behavior and a truthful example", () => {
    expect(tool.description.length).toBeGreaterThan(30);
    close(example.output, expected);
  });
  it("rejects explicitly unsupported domain evidence", () => {
    const x = { ...example.input, ...{ path: "/a?b" } } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
});

it("enforces batch-local text and dense-array budgets", () => {
  for (const [k, v] of Object.entries(example.input)) {
    if (typeof v === "string" && !k.endsWith("Json"))
      expect(() =>
        calculate({ ...example.input, [k]: "x".repeat(8193) } as Input),
      ).toThrow();
    if (Array.isArray(v)) {
      const huge =
        typeof v[0] === "string"
          ? Array(129).fill("x")
          : Array.isArray(v[0])
            ? Array.from({ length: 129 }, () => [0])
            : Array(10001).fill(0);
      expect(() =>
        calculate({ ...example.input, [k]: huge } as Input),
      ).toThrow();
    }
  }
});
