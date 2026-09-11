import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const close = (a: unknown, e: unknown): void => {
  if (typeof e === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - e)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(e)) * 1e-8,
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
  it("matches independently specified example result", () => {
    close(calculate(example.input), example.output);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, example.output);
  });
  it("publishes valid contracts and JSON schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("requires own root fields and rejects extras", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null, type errors and non-finite inputs", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic without rewriting observations", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    close(calculate(x), example.output);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("rejects sparse, inherited and oversized observation slots", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const x = Array(1);
        Object.setPrototypeOf(
          x,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: x })).toThrow();
        const huge =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: huge })).toMatchObject({
          ok: false,
        });
      }
  });
  it("rejects unsupported domains or evidence", () => {
    const x = {
      ...example.input,
      callerMatchedConvectiveHeatTransferCoefficient: 0,
    };
    expect(() => calculate(x as unknown as Input)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
  it("retains actual boundary or unknown evidence", () => {
    const x = { ...example.input };
    close(calculate(x), { result: { value: 2 } });
    const r = tool.execute(x);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, { result: { value: 2 } });
  });
});
