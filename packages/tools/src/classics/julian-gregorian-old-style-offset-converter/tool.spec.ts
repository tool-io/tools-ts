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
  it("matches independent canonical observations and reference entries", () => {
    close(calculate(example.input), example.output);
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, example.output);
  });
  it("publishes valid portable contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing, unknown and inherited root fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects wrong types and nonfinite inputs", () => {
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
  it("is deterministic and does not rewrite caller evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    expect(calculate(input)).toEqual(calculate(input));
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds arrays and rejects sparse or inherited slots", () => {
    for (const [k, v] of Object.entries(example.input))
      if (Array.isArray(v)) {
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
        const tooBig =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: tooBig })).toMatchObject({
          ok: false,
        });
      }
  });
  it("rejects invalid domain assumptions", () => {
    const input = {
      ...example.input,
      julianYear: 1901,
      julianMonth: 2,
      julianDay: 29,
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("retains independent boundary values or unknown evidence", () => {
    const input = {
      ...example.input,
      julianYear: 2000,
      julianMonth: 1,
      julianDay: 1,
    };
    close(calculate(input), {
      result: {
        prolepticGregorianDate: "2000-01-14",
        gregorianMinusJulianNominalDays: 13,
      },
    });
    const r = tool.execute(input);
    expect(r.ok).toBe(true);
    if (r.ok)
      close(r.output, {
        result: {
          prolepticGregorianDate: "2000-01-14",
          gregorianMinusJulianNominalDays: 13,
        },
      });
  });
});
describe("proleptic century boundaries", () => {
  it("converts Gregorian century leap omissions from actual Julian dates", () => {
    expect(
      calculate({ julianYear: 1900, julianMonth: 2, julianDay: 16 }).result,
    ).toEqual({
      prolepticGregorianDate: "1900-02-28",
      gregorianMinusJulianNominalDays: 12,
    });
    expect(
      calculate({ julianYear: 1900, julianMonth: 2, julianDay: 17 }).result,
    ).toEqual({
      prolepticGregorianDate: "1900-03-01",
      gregorianMinusJulianNominalDays: 13,
    });
    expect(
      calculate({ julianYear: 2100, julianMonth: 2, julianDay: 16 }).result,
    ).toEqual({
      prolepticGregorianDate: "2100-03-01",
      gregorianMinusJulianNominalDays: 14,
    });
  });
  it("handles 400-year leap days and the historical reform without adoption inference", () => {
    expect(
      calculate({ julianYear: 2000, julianMonth: 2, julianDay: 29 }).result
        .prolepticGregorianDate,
    ).toBe("2000-03-13");
    expect(
      calculate({ julianYear: 1582, julianMonth: 10, julianDay: 4 }).result
        .prolepticGregorianDate,
    ).toBe("1582-10-14");
  });
  it("rejects invalid civil fields and allows earliest positive Gregorian anchor", () => {
    expect(
      calculate({ julianYear: 1, julianMonth: 1, julianDay: 3 }).result,
    ).toEqual({
      prolepticGregorianDate: "0001-01-01",
      gregorianMinusJulianNominalDays: -2,
    });
    for (const input of [
      { julianYear: 1901, julianMonth: 2, julianDay: 29 },
      { julianYear: 2000, julianMonth: 4, julianDay: 31 },
      { julianYear: 0, julianMonth: 1, julianDay: 1 },
    ])
      expect(() => calculate(input)).toThrow();
  });
});
