import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: {
    leapSecondsSince1972: 27,
    taiMinusUtcSeconds: 37,
    reference: "IERS Bulletin C 72, valid before 2027-06-28",
  },
};
export const close = (a: unknown, b: unknown): void => {
  if (typeof b === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - b)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(b)) * 1e-9,
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
  it("matches an independent canonical value", () =>
    close(calculate(example.input), expected));
  it("executes the same public calculation", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes valid contract and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own explicit fields and rejects extras", () => {
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects nulls and wrong types", () => {
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
  it("rejects nonfinite numbers and sparse arrays", () => {
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
  it("bounds strings and dense lists", () => {
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
  it("does not mutate evidence or consult ambient randomness", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      s = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(s);
    close(example.output, expected);
  });
  it("refuses unsupported physical/domain evidence", () => {
    const x = {
      ...example.input,
      ...{ utcDate: "2027-06-28" },
    } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
});

// Independent Python/PROJ/GeographicLib fixtures and physical boundary regressions.
const physicalCases = [
  {
    label: "IERS published leap history 1972-01-01",
    input: { utcDate: "1972-01-01" },
    expected: { leapSecondsSince1972: 0, taiMinusUtcSeconds: 10 },
    tolerance: 1e-8,
  },
  {
    label: "IERS published leap history 1972-06-30",
    input: { utcDate: "1972-06-30" },
    expected: { leapSecondsSince1972: 0, taiMinusUtcSeconds: 10 },
    tolerance: 1e-8,
  },
  {
    label: "IERS published leap history 1972-07-01",
    input: { utcDate: "1972-07-01" },
    expected: { leapSecondsSince1972: 1, taiMinusUtcSeconds: 11 },
    tolerance: 1e-8,
  },
  {
    label: "IERS published leap history 2016-12-31",
    input: { utcDate: "2016-12-31" },
    expected: { leapSecondsSince1972: 26, taiMinusUtcSeconds: 36 },
    tolerance: 1e-8,
  },
  {
    label: "IERS published leap history 2017-01-01",
    input: { utcDate: "2017-01-01" },
    expected: { leapSecondsSince1972: 27, taiMinusUtcSeconds: 37 },
    tolerance: 1e-8,
  },
  {
    label: "IERS published leap history 2026-10-19",
    input: { utcDate: "2026-10-19" },
    expected: { leapSecondsSince1972: 27, taiMinusUtcSeconds: 37 },
    tolerance: 1e-8,
  },
  {
    label: "IERS published leap history 2027-06-27",
    input: { utcDate: "2027-06-27" },
    expected: { leapSecondsSince1972: 27, taiMinusUtcSeconds: 37 },
    tolerance: 1e-8,
  },
  {
    label: "table has no pre1972 continuous model",
    input: { utcDate: "1971-12-31" },
    reject: true,
  },
  {
    label: "do not assume future no-leap policy",
    input: { utcDate: "2030-01-01" },
    reject: true,
  },
  {
    label: "civil leap day validated",
    input: { utcDate: "2026-02-29" },
    reject: true,
  },
] as const;
it.each(physicalCases)("$label", (fixture) => {
  const input = fixture.input as unknown as Input;
  if ("reject" in fixture) {
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
    return;
  }
  const output = calculate(input).result;
  const compare = (actual: unknown, wanted: unknown): void => {
    if (typeof wanted === "number") {
      expect(typeof actual).toBe("number");
      expect(Math.abs((actual as number) - wanted)).toBeLessThanOrEqual(
        fixture.tolerance,
      );
    } else if (Array.isArray(wanted)) {
      expect(Array.isArray(actual)).toBe(true);
      expect((actual as unknown[]).length).toBe(wanted.length);
      wanted.forEach((v, j) => compare((actual as unknown[])[j], v));
    } else if (wanted !== null && typeof wanted === "object") {
      for (const [k, v] of Object.entries(wanted))
        compare((actual as Record<string, unknown>)[k], v);
    } else expect(actual).toEqual(wanted);
  };
  compare(output, fixture.expected);
  const publicRun = tool.execute(input);
  expect(publicRun.ok).toBe(true);
  if (publicRun.ok) compare(publicRun.output.result, fixture.expected);
});
