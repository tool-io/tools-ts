import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = { result: { classification: "normal", exponent: 0 } };
const close = (a: unknown, b: unknown): void => {
  if (typeof b === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - b)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(b)) * 1e-10,
    );
  } else if (Array.isArray(b)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(b.length);
    b.forEach((v, j) => close((a as unknown[])[j], v));
  } else if (b && typeof b === "object") {
    expect(a !== null && typeof a === "object").toBe(true);
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(b).sort());
    for (const [k, v] of Object.entries(b))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(b);
};
describe(tool.id, () => {
  it("matches the independently specified fixture", () =>
    close(calculate(example.input), expected));
  it("executes the same calculation", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes a valid contract and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects null and wrong field types", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(
        tool.execute({
          ...example.input,
          [k]: typeof v === "string" ? 1 : "bad",
        }),
      ).toMatchObject({ ok: false });
    }
  });
  it("rejects nonfinite and sparse evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
    }
  });
  it("enforces bounded strings and explicit arrays", () => {
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
  it("is reproducible and does not mutate inputs", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      s = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(s);
    close(example.output, expected);
  });
});

// Batch 55 targeted regressions
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "0" } as Input), {
    result: { classification: "zero", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "1" } as Input), {
    result: { classification: "subnormal", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "8388608" } as Input), {
    result: { classification: "normal", exponent: -126 },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2139095039" } as Input), {
    result: { classification: "normal", exponent: 127 },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2139095040" } as Input), {
    result: { classification: "infinity", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2139095041" } as Input), {
    result: { classification: "nan", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2143289344" } as Input), {
    result: { classification: "nan", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2147483648" } as Input), {
    result: { classification: "zero", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2147483649" } as Input), {
    result: { classification: "subnormal", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "2155872256" } as Input), {
    result: { classification: "normal", exponent: -126 },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "4286578687" } as Input), {
    result: { classification: "normal", exponent: 127 },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "4286578688" } as Input), {
    result: { classification: "infinity", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "4286578689" } as Input), {
    result: { classification: "nan", exponent: null },
  });
}, 30000);
it("covers independently specified domain boundary", () => {
  close(calculate({ pattern: "4290772992" } as Input), {
    result: { classification: "nan", exponent: null },
  });
}, 30000);
