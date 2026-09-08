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
  it("matches independently specified calculations or source-qualified records", () => {
    close(calculate(example.input), example.output);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, example.output);
  });
  it("publishes valid contracts and portable JSON schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("requires own root fields and rejects extra keys", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null, type errors and nonfinite observations", () => {
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
  it("is deterministic without rewriting supplied evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    expect(calculate(input)).toEqual(calculate(input));
    expect(JSON.stringify(input)).toBe(before);
  });
  it("rejects sparse, inherited or oversized array observations", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
        const large =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: large })).toMatchObject({
          ok: false,
        });
      }
  });
  it("rejects unsupported domains, keys or calibration", () => {
    const input = { ...example.input, independentlyIdentifiedFdiTooth: "19" };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("retains independently specified boundary or unknown evidence", () => {
    const input = { ...example.input, independentlyIdentifiedFdiTooth: "85" };
    close(calculate(input), { result: { universalTooth: "T" } });
    const r = tool.execute(input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, { result: { universalTooth: "T" } });
  });
});
it("regression: maps all32permanent and20primary standard tooth identifiers", () => {
  const fdi: string[] = [],
    u: string[] = [];
  for (let q = 1; q <= 4; q++)
    for (let n = 1; n <= 8; n++) {
      fdi.push(String(q * 10 + n));
      u.push(
        String(q === 1 ? 9 - n : q === 2 ? 8 + n : q === 3 ? 25 - n : 24 + n),
      );
    }
  for (let q = 5; q <= 8; q++)
    for (let n = 1; n <= 5; n++) {
      fdi.push(String(q * 10 + n));
      u.push(
        String.fromCharCode(
          q === 5 ? 70 - n : q === 6 ? 69 + n : q === 7 ? 80 - n : 79 + n,
        ),
      );
    }
  fdi.forEach((t, i) =>
    expect(
      calculate({ independentlyIdentifiedFdiTooth: t }).result.universalTooth,
    ).toBe(u[i]),
  );
  expect(new Set(u).size).toBe(52);
});
