import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import tool, { calculate, example, type Input } from "./tool.js";
const ctx: ToolExecutionContext = { random: () => 0 };
const expected = {
  result: {
    selectedTexts: ["Science", "Science"],
    samplingConvention: "uniform-with-replacement",
  },
};
const close = (a: unknown, e: unknown): void => {
  if (typeof e === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - e)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(e)) * 1e-7,
    );
  } else if (Array.isArray(e)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(e.length);
    e.forEach((v, i) => close((a as unknown[])[i], v));
  } else if (e && typeof e === "object") {
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(e).sort());
    for (const [k, v] of Object.entries(e))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(e);
};
describe(tool.id, () => {
  it("matches independently specified fixture", () => {
    close(calculate(example.input, ctx), expected);
    const r = tool.execute(example.input, ctx);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes valid contract and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(tool.execute({}, ctx)).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true }, ctx)).toMatchObject({
      ok: false,
    });
    expect(() =>
      calculate(Object.create(example.input) as Input, ctx),
    ).toThrow();
  });
  it("rejects null,type errors,nonfinite and sparse observations", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null }, ctx)).toMatchObject({
        ok: false,
      });
      if (typeof v === "number")
        expect(() => calculate({ ...example.input, [k]: NaN }, ctx)).toThrow();
      if (Array.isArray(v)) {
        expect(
          tool.execute({ ...example.input, [k]: [NaN] }, ctx),
        ).toMatchObject({ ok: false });
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) }, ctx),
        ).toThrow();
      }
    }
  });
  it("is reproducible without mutating observations", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      b = JSON.stringify(x);
    close(calculate(x, ctx), expected);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(b);
  });
  it("rejects unsupported domains", () => {
    const x = { ...example.input, count: 0 } as unknown as Input;
    expect(() => calculate(x, ctx)).toThrow();
    expect(tool.execute(x, ctx)).toMatchObject({ ok: false });
  });
  it("retains boundary,signed,tied or unknown evidence", () => {
    close(calculate({ ...example.input, count: 1 } as unknown as Input, ctx), {
      result: {
        selectedTexts: ["Science"],
        samplingConvention: "uniform-with-replacement",
      },
    });
  });
  it("rejects invalid injected randomness and overlarge seed", () => {
    for (const v of [NaN, -0.1, 1, Infinity])
      expect(() => calculate(example.input, { random: () => v })).toThrow();
    expect(() =>
      calculate({ ...example.input, seed: "x".repeat(257) }, ctx),
    ).toThrow();
  });
  it("uses actual advancing injected source independently of seed text", () => {
    let calls = 0;
    const advance = () => ((calls++ % 9) + 0.5) / 10;
    const a = calculate(example.input, { random: advance }),
      n = calls;
    expect(n).toBeGreaterThan(0);
    calls = 0;
    const b = calculate(
      { ...example.input, seed: "different-seed" },
      { random: advance },
    );
    expect(b).toEqual(a);
    expect(calls).toBe(n);
  });
});
